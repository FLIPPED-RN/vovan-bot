require('dotenv').config();
const { Telegraf } = require('telegraf');
const config = require('./src/config/config');
const sequelize = require('./src/config/database');
const fs = require('fs');
const path = require('path');
const groupOnly = require('./src/utils/chatMiddleware');

const bot = new Telegraf(config.BOT_TOKEN);

// Инициализация базы данных
async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('База данных подключена успешно.');
        
        // Принудительно создаем таблицы (force: true пересоздаст таблицы)
        await sequelize.sync({ alter: true });
        console.log('Модели синхронизированы с базой данных.');
    } catch (error) {
        console.error('Ошибка при подключении к базе данных:', error);
        process.exit(1);
    }
}

// Запускаем инициализацию базы данных перед стартом бота
initDatabase().then(() => {
    // Применяем middleware для всех сообщений
    bot.use(groupOnly);

    // Динамическая загрузка команд
    const commandsPath = path.join(__dirname, 'src', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        bot.command(command.command, command.execute);
    }

    bot.launch();

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
});