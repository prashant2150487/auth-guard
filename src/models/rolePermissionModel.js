import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import { Role } from "./roleModel.js";
import { Permission } from "./permissionModel.js";

export const RolePermission = sequelize.define("RolePermission", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'id'
        }
    },
    permissionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Permission,
            key: 'id'
        }
    }
});

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId' });
