import { Permission } from '../models/permissionModel.js';
import { Role } from '../models/roleModel.js';

// Create Permission
export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Payload validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Permission name is required",
      });
    }

    // Check if permission already exists
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      return res.status(400).json({
        success: false,
        message: "Permission already exists",
      });
    }

    // Create permission
    const permission = await Permission.create({
      name,
      description: description || null
    });

    res.status(201).json({
      success: true,
      message: "Permission created successfully",
      data: { permission },
    });
  } catch (error) {
    console.error("Create permission error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All Permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: { permissions },
      count: permissions.length,
    });
  } catch (error) {
    console.error("Get permissions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Permission by ID
export const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id, {
      include: [{
        model: Role,
        through: { attributes: [] }
      }]
    });

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { permission },
    });
  } catch (error) {
    console.error("Get permission error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Permission
export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== permission.name) {
      const existingPermission = await Permission.findOne({ where: { name } });
      if (existingPermission) {
        return res.status(400).json({
          success: false,
          message: "Permission name already exists",
        });
      }
      permission.name = name;
    }

    if (description !== undefined) permission.description = description;
    await permission.save();

    res.status(200).json({
      success: true,
      message: "Permission updated successfully",
      data: { permission },
    });
  } catch (error) {
    console.error("Update permission error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Permission
export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    await permission.destroy();

    res.status(200).json({
      success: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    console.error("Delete permission error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};