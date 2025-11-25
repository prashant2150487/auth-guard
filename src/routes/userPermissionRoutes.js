import express from 'express';
import {
    assignPermissionToUser,
    bulkAssignPermissions,
    removePermissionFromUser,
    getUserPermissions
} from '../controllers/userPermissionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.post('/:userId/permissions', protect, assignPermissionToUser);
router.post('/:userId/permissions/bulk', protect, bulkAssignPermissions);
router.delete('/:userId/permissions/:permissionId', protect, removePermissionFromUser);
router.get('/:userId/permissions', protect, getUserPermissions);

export default router;
