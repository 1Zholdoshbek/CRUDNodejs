// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateProduct = require('../middleware/validateProduct');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все продукты
 *     description: Получить список всех продуктов с поддержкой пагинации.
 *     responses:
 *       200:
 *         description: Список продуктов
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить продукт по ID
 *     description: Получить информацию о продукте по его ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт найден
 *       404:
 *         description: Продукт не найден
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый продукт
 *     description: Добавить новый продукт в базу данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Продукт создан
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить продукт
 *     description: Обновить информацию о продукте по его ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID продукта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Продукт обновлен
 *       404:
 *         description: Продукт не найден
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить продукт
 *     description: Удалить продукт по его ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт успешно удален
 *       404:
 *         description: Продукт не найден
 */

router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', validateProduct, productController.createProduct);
router.put('/products/:id', validateProduct, productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;

