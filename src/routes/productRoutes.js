import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    toggleProductStatus
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { hasPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Product CRUD operations with permission-based access
router.get('/', protect, getAllProducts);
router.get('/:id', protect, hasPermission('products.read'), getProductById);
router.post('/', protect, hasPermission('products.create'), createProduct);
router.put('/:id', protect, hasPermission('products.update'), updateProduct);
router.delete('/:id', protect, hasPermission('products.delete'), deleteProduct);
router.delete('/', protect, hasPermission('products.delete'), bulkDeleteProducts);
router.patch('/:id/toggle-status', protect, hasPermission('products.update'), toggleProductStatus);

export default router;
