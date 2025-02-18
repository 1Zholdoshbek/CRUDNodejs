const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/nodejs', {
    dialect: 'postgres',
    logging: false,  // Отключаем логирование запросов в консоль
});

module.exports = sequelize;
