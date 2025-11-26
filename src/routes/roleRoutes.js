import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createRole, getAllRoles, getRoleById, updateRole, deleteRole } from '../controllers/roleController.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, createRole);
router.get('/', protect, getAllRoles);
router.get('/:id', protect, getRoleById);
router.put('/:id', protect, updateRole);
router.delete('/:id', protect, deleteRole);

export default router;