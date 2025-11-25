import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Role } from "../models/roleModel.js";
import { Permission } from "../models/permissionModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify access token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user still exists
      const user = await User.findByPk(decoded.id, {
        attributes: ["id", "name", "email"],
        include: [
          {
            model: Role,
            attributes: ['id', 'name'],
            include: [{
              model: Permission,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }]
          },
          {
            model: Permission,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }
        ]
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User no longer exists",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Access token expired",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
