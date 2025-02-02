const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Отключаем логи SQL-запросов
    ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
});

module.exports = sequelize; 