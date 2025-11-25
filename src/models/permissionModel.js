import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

export const Permission = sequelize.define("Permission", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.STRING }
});
