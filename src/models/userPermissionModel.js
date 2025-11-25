import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import { User } from "./userModel.js";
import { Permission } from "./permissionModel.js";

export const UserPermission = sequelize.define("UserPermission", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Permission,
            key: 'id'
        }
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['userId', 'permissionId']
        }
    ]
});

// Define associations
User.belongsToMany(Permission, { through: UserPermission, foreignKey: 'userId' });
Permission.belongsToMany(User, { through: UserPermission, foreignKey: 'permissionId' });
