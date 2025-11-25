import { Role } from '../models/roleModel.js';
import { Permission } from '../models/permissionModel.js';
import { RolePermission } from '../models/rolePermissionModel.js';

// Create Role
export const createRole = async (req, res) => {
  try {
    const { name, description, permissionIds } = req.body;

    // Payload validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role already exists",
      });
    }

    // Create role
    const role = await Role.create({
      name,
      description: description || null
    });

    // Add permissions if provided
    if (permissionIds && permissionIds.length > 0) {
      const permissions = await Permission.findAll({
        where: { id: permissionIds }
      });
      await role.setPermissions(permissions);
    }

    // Get role with permissions
    const roleWithPermissions = await Role.findByPk(role.id, {
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: { role: roleWithPermissions },
    });
  } catch (error) {
    console.error("Create role error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All Roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        through: { attributes: [] }
      }],
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: { roles },
      count: roles.length,
    });
  } catch (error) {
    console.error("Get roles error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Role by ID
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { role },
    });
  } catch (error) {
    console.error("Get role error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Role
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissionIds } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: "Role name already exists",
        });
      }
      role.name = name;
    }

    if (description !== undefined) role.description = description;
    await role.save();

    // Update permissions if provided
    if (permissionIds) {
      const permissions = await Permission.findAll({
        where: { id: permissionIds }
      });
      await role.setPermissions(permissions);
    }

    // Get updated role with permissions
    const updatedRole = await Role.findByPk(id, {
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: { role: updatedRole },
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Role
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    await role.destroy();

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Delete role error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Add Permissions to Role
export const addPermissionsToRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;

    if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide permission IDs array",
      });
    }

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const permissions = await Permission.findAll({
      where: { id: permissionIds }
    });

    if (permissions.length !== permissionIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some permissions not found",
      });
    }

    await role.addPermissions(permissions);

    const updatedRole = await Role.findByPk(id, {
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });

    res.status(200).json({
      success: true,
      message: "Permissions added to role successfully",
      data: { role: updatedRole },
    });
  } catch (error) {
    console.error("Add permissions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Remove Permissions from Role
export const removePermissionsFromRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;

    if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide permission IDs array",
      });
    }

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const permissions = await Permission.findAll({
      where: { id: permissionIds }
    });

    await role.removePermissions(permissions);

    const updatedRole = await Role.findByPk(id, {
      include: [{
        model: Permission,
        through: { attributes: [] }
      }]
    });

    res.status(200).json({
      success: true,
      message: "Permissions removed from role successfully",
      data: { role: updatedRole },
    });
  } catch (error) {
    console.error("Remove permissions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create Role Payload:

// {
//   "name": "admin",
//   "description": "Administrator role with full access",
//   "permissionIds": [1, 2, 3, 4]
// }
// Update Role Payload:
// {
//   "name": "superadmin",
//   "description": "Super Administrator role",
//   "permissionIds": [1, 2, 3, 4, 5]
// Add Permissions to Role Payload:
// {
//   "permissionIds": [1, 2, 3]
// }
// Create Permission Payload:
// {
//   "name": "user.create",
//   "description": "Create new users"
// }