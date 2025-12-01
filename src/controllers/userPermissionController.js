import { User } from "../models/userModel.js";
import { Permission } from "../models/permissionModel.js";
import { UserPermission } from "../models/userPermissionModel.js";

// Assign a permission to a user
export const assignPermissionToUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { permissionId } = req.body;

        if (!permissionId) {
            return res.status(400).json({
                success: false,
                message: "Permission ID is required"
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

// Replace all user permissions with new ones (bulk assign)
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

        // Delete ALL existing permissions for this user
        const deletedCount = await UserPermission.destroy({
            where: { userId }
        });

        // Create new user permissions (replace with new ones)
        const userPermissions = permissionIds.map(permissionId => ({
            userId,
            permissionId
        }));

        await UserPermission.bulkCreate(userPermissions);

        res.status(200).json({
            success: true,
            message: "User permissions replaced successfully",
            data: {
                userId,
                previousPermissions: deletedCount,
                newPermissions: permissionIds.length,
                assignedPermissionIds: permissionIds
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

// Get all permissions with assigned status for a user
export const getUserPermissions = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user exists
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get all permissions from database
        const allPermissions = await Permission.findAll({
            attributes: ['id', 'name', 'description'],
            order: [['id', 'ASC']]
        });

        // Get user's assigned permissions
        const userPermissions = await UserPermission.findAll({
            where: { userId },
            attributes: ['permissionId']
        });

        // Create a Set of assigned permission IDs for quick lookup
        const assignedPermissionIds = new Set(
            userPermissions.map(up => up.permissionId)
        );

        // Map all permissions with isAssigned flag
        const permissionsWithStatus = allPermissions.map(permission => ({
            id: permission.id,
            name: permission.name,
            description: permission.description,
            isAssigned: assignedPermissionIds.has(permission.id)
        }));

        // Count assigned permissions
        const assignedCount = permissionsWithStatus.filter(p => p.isAssigned).length;

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                permissions: permissionsWithStatus,
                summary: {
                    total: allPermissions.length,
                    assigned: assignedCount,
                    notAssigned: allPermissions.length - assignedCount
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
