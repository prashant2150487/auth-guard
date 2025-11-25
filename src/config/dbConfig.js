import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
    }
);

export const initDB = async () => {
    console.log(process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS, 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
    try {
        await sequelize.authenticate();
        console.log("MySQL Connected via Sequelize");
        await sequelize.sync({ alter: true });
        console.log("Models synced");
    } catch (error) {
        console.error("DB Error:", error);
    }
};
