const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vodka = sequelize.define('Vodka', {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastAttempt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'vodka',
    timestamps: true,
    freezeTableName: true
});

(async () => {
    try {
        await Vodka.sync({ alter: true });
        console.log("Таблица vodka успешно создана (или обновлена)");
    } catch (error) {
        console.error("Ошибка при создании таблицы vodka:", error);
    }
})();

module.exports = Vodka;