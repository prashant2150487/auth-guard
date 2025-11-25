import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { signUp, login, getProfile, updateProfile, changePassword, logout, deleteAccount, refreshToken, forgotPassword, resetPassword } from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/logout", protect, logout);
router.post("/deleteAccount", protect, deleteAccount);
router.post("/refreshToken", refreshToken);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);


export default router;
// import { DataTypes } from "sequelize";
// import { sequelize } from "../config/dbConfig.js";

// export const Role = sequelize.define("Role", {
//     id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     name: { type: DataTypes.STRING, unique: true, allowNull: false },
//     description: { type: DataTypes.STRING }
// });
