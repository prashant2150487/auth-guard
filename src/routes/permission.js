import express from 'express';
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission
} from '../controllers/permissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { hasPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, hasPermission('permissions.create'), createPermission);
router.get('/', protect, hasPermission('permissions.read'), getAllPermissions);
router.get('/:id', protect, hasPermission('permissions.read'), getPermissionById);
router.put('/:id', protect, hasPermission('permissions.update'), updatePermission);
router.delete('/:id', protect, hasPermission('permissions.delete'), deletePermission);

export default router;