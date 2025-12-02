import { Product } from "../models/productModel.js";
import { Op } from "sequelize";

// Get all products with pagination and search
export const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, isActive } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};

        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { subtitle: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                products: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create new product
export const createProduct = async (req, res) => {
    try {
        const { title, subtitle, description, permission, image, price, isActive=true } = req.body;

        // Validation: Check required fields
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Description is required'
            });
        }

        // Validate title length
        if (title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Title must be at least 3 characters long'
            });
        }

        // Validate description length
        if (description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Description must be at least 10 characters long'
            });
        }

        // Create product with validated data
        const product = await Product.create({
            title: title.trim(),
            subtitle: subtitle?.trim() || null,
            description: description.trim(),
            image: image || null,
            price: price || null,
            isActive: isActive !== undefined ? isActive : true,
            permission: permission || null
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: {
                ...product.toJSON(),
                permission: permission || null // Include permission in response for frontend
            }
        });
    } catch (error) {
        console.error('Create product error:', error);

        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }

        // Handle unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'A product with this information already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, description, image, price, isActive } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.update({
            title: title !== undefined ? title : product.title,
            subtitle: subtitle !== undefined ? subtitle : product.subtitle,
            description: description !== undefined ? description : product.description,
            image: image !== undefined ? image : product.image,
            price: price !== undefined ? price : product.price,
            isActive: isActive !== undefined ? isActive : product.isActive
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.destroy();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Bulk delete products
export const bulkDeleteProducts = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Product IDs array is required'
            });
        }

        const deletedCount = await Product.destroy({
            where: { id: ids }
        });

        res.status(200).json({
            success: true,
            message: `${deletedCount} product(s) deleted successfully`,
            data: { deletedCount }
        });
    } catch (error) {
        console.error('Bulk delete products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Toggle product active status
export const toggleProductStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.update({
            isActive: !product.isActive
        });

        res.status(200).json({
            success: true,
            message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
            data: product
        });
    } catch (error) {
        console.error('Toggle product status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
