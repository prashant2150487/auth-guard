import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import { Role } from '../models/roleModel.js';
import { Permission } from '../models/permissionModel.js';
import { sequelize } from '../config/dbConfig.js';
import { Op } from 'sequelize';

// Get all users with pagination and filters
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, roleId, search } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (roleId) whereClause.roleId = roleId;
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            attributes: ['id', 'name', 'email', 'phone', 'image', 'roleId', 'createdAt'],
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name'],

                },
                {
                    model: Permission,
                    attributes: ['id', 'name', 'description'],
                    through: { attributes: [] }
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                users: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: ['id', 'name', 'email', 'phone', 'image', 'roleId', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name', 'description'],
                    include: [{
                        model: Permission,
                        attributes: ['id', 'name', 'description'],
                        through: { attributes: [] }
                    }]
                },
                {
                    model: Permission,
                    attributes: ['id', 'name', 'description'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create new user (Admin only)
export const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, image, roleId } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            image: image || null,
            roleId: roleId || null
        });

        // Remove password from response
        user.password = undefined;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, image, roleId } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
        }

        // Update fields
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (image !== undefined) user.image = image;
        if (roleId !== undefined) user.roleId = roleId;

        await user.save();

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting yourself
        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        await user.destroy();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update user password (Admin)
export const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User password updated successfully'
        });
    } catch (error) {
        console.error('Update user password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update user role
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { roleId } = req.body;

        if (!roleId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide roleId'
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if role exists
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        user.roleId = roleId;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get users by role
export const getUsersByRole = async (req, res) => {
    try {
        const { roleId } = req.params;

        const users = await User.findAll({
            where: { roleId },
            attributes: ['id', 'name', 'email', 'phone', 'image', 'createdAt'],
            include: [{
                model: Role,
                attributes: ['id', 'name']
            }]
        });

        res.status(200).json({
            success: true,
            data: {
                count: users.length,
                users
            }
        });
    } catch (error) {
        console.error('Get users by role error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Bulk delete users
export const bulkDeleteUsers = async (req, res) => {
    try {
        const { userIds } = req.body;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of user IDs'
            });
        }

        // Prevent deleting yourself
        if (userIds.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        const deletedCount = await User.destroy({
            where: { id: userIds }
        });

        res.status(200).json({
            success: true,
            message: `${deletedCount} user(s) deleted successfully`,
            data: { deletedCount }
        });
    } catch (error) {
        console.error('Bulk delete users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get user statistics
export const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.count();

        const usersByRole = await User.findAll({
            attributes: [
                'roleId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            include: [{
                model: Role,
                attributes: ['name']
            }],
            group: ['roleId', 'Role.id', 'Role.name']
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                usersByRole
            }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
