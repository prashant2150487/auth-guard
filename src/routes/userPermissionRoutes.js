import express from 'express';
import {
    assignPermissionToUser,
    bulkAssignPermissions,
    removePermissionFromUser,
    getUserPermissions
} from '../controllers/userPermissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { hasAllPermissions, hasPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();

// All routes are protected and require specific permissions
router.post('/:userId/permissions', protect, hasPermission('permissions.create'), assignPermissionToUser);
router.post('/:userId/permissions/bulk', protect, hasPermission('permissions.create'), bulkAssignPermissions);
router.delete('/:userId/permissions/:permissionId', protect, hasPermission('permissions.delete'), removePermissionFromUser);
router.get('/:userId/permissions', protect, hasPermission('permissions.read'), getUserPermissions);

export default router;
