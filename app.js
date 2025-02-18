const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User');
const sequelize = require('./config/database');  // Импортируем объект sequelize
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth/authRoutes');
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
app.use('/api/auth',authRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});


sequelize.sync()
    .then(() => {
        console.log('Таблицы синхронизированы');
    })
    .catch((error) => {
        console.error('Ошибка синхронизации с базой данных:', error);
    });
