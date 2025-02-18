// controllers/productController.js
const pool = require('../config/database');

// Получить все продукты
const getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = req.query;
        const offset = (page - 1) * limit;

        const query = `
            SELECT * FROM products 
            ORDER BY ${sort} ${order}
            LIMIT $1 OFFSET $2
        `;

        const countQuery = 'SELECT COUNT(*) FROM products';

        const [products, countResult] = await Promise.all([
            pool.query(query, [limit, offset]),
            pool.query(countQuery)
        ]);

        const totalProducts = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            products: products.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalProducts,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        next(error);
    }
};

// Получить один продукт
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// Создать продукт
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, quantity } = req.body;
        const query = `
            INSERT INTO products (name, description, price, quantity)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await pool.query(query, [name, description, price, quantity]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// Обновить продукт
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity } = req.body;

        const query = `
            UPDATE products 
            SET name = $1, description = $2, price = $3, quantity = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `;

        const result = await pool.query(query, [name, description, price, quantity, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// Удалить продукт
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }

        res.json({ message: 'Продукт успешно удален', product: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};