
// middleware/validateProduct.js
const validateProduct = (req, res, next) => {
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
        return res.status(400).json({
            error: 'Отсутствуют обязательные поля',
            required: ['name', 'price', 'quantity']
        });
    }

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({
            error: 'Некорректная цена',
            message: 'Цена должна быть положительным числом'
        });
    }

    if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
        return res.status(400).json({
            error: 'Некорректное количество',
            message: 'Количество должно быть целым неотрицательным числом'
        });
    }

    next();
};

module.exports = validateProduct;