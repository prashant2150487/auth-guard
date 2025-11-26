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
    try {
        await sequelize.authenticate();
        console.log("MySQL Connected via Sequelize");
        await sequelize.sync({ alter: false });
        console.log("Models synced");

        // Seed default admin user using dynamic import to avoid circular dependency
        const { seedDefaultAdmin } = await import("./seeders.js");
        await seedDefaultAdmin();
    } catch (error) {
        console.error("DB Error:", error);
    }
};
