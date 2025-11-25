import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasPermission } from '../middleware/permissionMiddleware.js';
import { createRole } from '../controllers/roleController.js';


const router = express.Router();

// All routes are protected
router.post('/', protect, createRole);
// router.get('/', protect, getAllRoles);
// router.get('/:id', protect, getRoleById);
// router.put('/:id', protect, updateRole);
// router.delete('/:id', protect, deleteRole);
// router.post('/:id/permissions', protect, addPermissionsToRole);
// router.delete('/:id/permissions', protect, removePermissionsFromRole);

export default router;