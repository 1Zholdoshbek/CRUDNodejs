const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerSetup = require('./swagger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключение Swagger ДО объявления маршрутов
swaggerSetup(app);

// Routes
app.use('/api', productRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
