import { Role } from '../models/roleModel.js';

// Create Role
export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

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

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: { role },
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

    const role = await Role.findByPk(id);

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
    const { name, description } = req.body;

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

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: { role },
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