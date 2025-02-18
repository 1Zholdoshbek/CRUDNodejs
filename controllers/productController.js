// controllers/productController.js
const Product = require('../models/Product');

// Получить все продукты
const getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC' } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await Product.findAndCountAll({
            order: [[sort, order]],
            limit: parseInt(limit),
            offset: offset,
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            products: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalProducts: count,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Получить один продукт
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
};

// Создать продукт
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, quantity } = req.body;
        const product = await Product.create({ name, description, price, quantity });
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// Обновить продукт
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }

        product.name = name;
        product.description = description;
        product.price = price;
        product.quantity = quantity;
        await product.save();

        res.json(product);
    } catch (error) {
        next(error);
    }
};

// Удалить продукт
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }

        await product.destroy();
        res.json({ message: 'Продукт успешно удален', product });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};