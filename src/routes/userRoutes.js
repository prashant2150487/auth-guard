import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserPassword,
    updateUserRole,
    getUsersByRole,
    bulkDeleteUsers,
    getUserStats
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { hasPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User CRUD operations
router.get('/', protect, hasPermission('users.read'),  getAllUsers);                                    // Get all users with pagination
router.get('/stats', getUserStats);                              // Get user statistics
router.get('/role/:roleId', getUsersByRole);                     // Get users by role
router.get('/:id', getUserById);                                 // Get user by ID
router.post('/', createUser);                                    // Create new user
router.put('/:id', updateUser);                                  // Update user
router.delete('/:id', deleteUser);                               // Delete user
router.delete('/', bulkDeleteUsers);                             // Bulk delete users

// User management operations
router.put('/:id/password', updateUserPassword);                 // Update user password (Admin)
router.put('/:id/role', updateUserRole);                         // Update user role

export default router;
