import { DataTypes } from "sequelize";
import { Role } from "./roleModel.js";
import { sequelize } from "../config/dbConfig.js";


export const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING},
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'id'
        }
    }
});

User.belongsTo(Role, {
    foreignKey: 'roleId', onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Role.hasMany(User, { foreignKey: 'roleId' });
