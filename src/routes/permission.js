import express from 'express';
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission
} from '../controllers/permissionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, createPermission);
router.get('/', protect, getAllPermissions);
router.get('/:id', protect, getPermissionById);
router.put('/:id', protect, updatePermission);
router.delete('/:id', protect, deletePermission);

export default router;