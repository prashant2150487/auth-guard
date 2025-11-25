import { User } from "../models/userModel.js";
import { Permission } from "../models/permissionModel.js";
import { UserPermission } from "../models/userPermissionModel.js";
import { Role } from "../models/roleModel.js";

// Assign a permission to a user
export const assignPermissionToUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { permissionId } = req.body;

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if permission exists
        const permission = await Permission.findByPk(permissionId);
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found"
            });
        }

        // Check if user already has this permission
        const existingPermission = await UserPermission.findOne({
            where: { userId, permissionId }
        });

        if (existingPermission) {
            return res.status(400).json({
                success: false,
                message: "User already has this permission"
            });
        }

        // Assign permission to user
        await UserPermission.create({ userId, permissionId });

        res.status(201).json({
            success: true,
            message: "Permission assigned to user successfully",
            data: {
                userId,
                permissionId,
                permissionName: permission.name
            }
        });
    } catch (error) {
        console.error("Error assigning permission to user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Assign multiple permissions to a user
export const bulkAssignPermissions = async (req, res) => {
    try {
        const { userId } = req.params;
        const { permissionIds } = req.body;

        if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "permissionIds must be a non-empty array"
            });
        }

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if all permissions exist
        const permissions = await Permission.findAll({
            where: { id: permissionIds }
        });

        if (permissions.length !== permissionIds.length) {
            return res.status(404).json({
                success: false,
                message: "One or more permissions not found"
            });
        }

        // Get existing permissions to avoid duplicates
        const existingPermissions = await UserPermission.findAll({
            where: { userId, permissionId: permissionIds }
        });

        const existingPermissionIds = existingPermissions.map(up => up.permissionId);
        const newPermissionIds = permissionIds.filter(id => !existingPermissionIds.includes(id));

        // Create new user permissions
        const userPermissions = newPermissionIds.map(permissionId => ({
            userId,
            permissionId
        }));

        if (userPermissions.length > 0) {
            await UserPermission.bulkCreate(userPermissions);
        }

        res.status(201).json({
            success: true,
            message: "Permissions assigned to user successfully",
            data: {
                userId,
                assignedCount: newPermissionIds.length,
                skippedCount: existingPermissionIds.length
            }
        });
    } catch (error) {
        console.error("Error bulk assigning permissions:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Remove a permission from a user
export const removePermissionFromUser = async (req, res) => {
    try {
        const { userId, permissionId } = req.params;

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if permission exists
        const permission = await Permission.findByPk(permissionId);
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found"
            });
        }

        // Remove permission from user
        const deleted = await UserPermission.destroy({
            where: { userId, permissionId }
        });

        if (deleted === 0) {
            return res.status(404).json({
                success: false,
                message: "User does not have this permission"
            });
        }

        res.status(200).json({
            success: true,
            message: "Permission removed from user successfully"
        });
    } catch (error) {
        console.error("Error removing permission from user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all permissions for a user (both direct and from role)
export const getUserPermissions = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get user with role and permissions
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email'],
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name'],
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
                message: "User not found"
            });
        }

        // Combine permissions from role and user-specific
        const rolePermissions = user.Role?.Permissions || [];
        const userPermissions = user.Permissions || [];

        // Create a map to avoid duplicates
        const permissionMap = new Map();

        rolePermissions.forEach(p => {
            permissionMap.set(p.id, {
                id: p.id,
                name: p.name,
                description: p.description,
                source: 'role'
            });
        });

        userPermissions.forEach(p => {
            if (permissionMap.has(p.id)) {
                // If permission exists from role, mark as both
                permissionMap.get(p.id).source = 'both';
            } else {
                permissionMap.set(p.id, {
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    source: 'user'
                });
            }
        });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.Role ? {
                        id: user.Role.id,
                        name: user.Role.name
                    } : null
                },
                permissions: Array.from(permissionMap.values()),
                summary: {
                    total: permissionMap.size,
                    fromRole: rolePermissions.length,
                    userSpecific: userPermissions.length
                }
            }
        });
    } catch (error) {
        console.error("Error getting user permissions:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
