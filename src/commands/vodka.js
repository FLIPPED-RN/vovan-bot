const { getUserVodka, updateUserVodka, checkCooldown } = require('../utils/userStorage');

const getRandomAmount = () => {
    // Случайное число от -5 до 5
    return Math.floor(Math.random() * 11) - 5;
};

const getRandomMessage = (amount, total) => {
    if (amount > 0) {
        const messages = [
            `Вы смогли спиздить у дяди Вовы ${amount} чекушек, у вас теперь ${total} чекушек. Будьте осторожны в следующий раз, он может вас найти и отпиздить!`,
            `Повезло! Пока дядя Вова спал, вы стащили ${amount} чекушек. Теперь у вас ${total} чекушек.`,
            `Дядя Вова был добр и поделился ${amount} чекушками. Ваш запас: ${total} чекушек.`
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    } else {
        const messages = [
            `Дядя Вова поймал вас и отобрал ${Math.abs(amount)} чекушек! У вас осталось ${total} чекушек.`,
            `Вы споткнулись и разбили ${Math.abs(amount)} чекушек. Теперь у вас ${total} чекушек.`,
            `"Где мои чекушки?!" - заорал дядя Вова и отобрал ${Math.abs(amount)} штук. У вас осталось ${total} чекушек.`,
            `Дядя Вова сказал, что вы не можете спиздить чекушки, так что он отобрал ${Math.abs(amount)} чекушек. У вас осталось ${total} чекушек.`
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
};

const formatTimeLeft = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}мин`;
};

module.exports = {
    command: 'vodka',
    description: 'Попытаться спиздить чекушки у дяди Вовы (раз в 6 часов)',
    execute: async (ctx) => {
        try {
            // Получаем правильный ID пользователя
            const userId = ctx.from.id.toString();
            const username = ctx.from.username || 'anonymous';
            
            console.log('Команда vodka от пользователя:', { userId, username });
            
            // Проверяем время последней попытки
            const cooldownCheck = await checkCooldown(userId);
            if (!cooldownCheck.canAttempt) {
                return ctx.reply(`Дядя Вова еще не забыл ваше лицо! Приходите через ${formatTimeLeft(cooldownCheck.timeLeft)}`);
            }

            const amount = getRandomAmount();
            console.log('Сгенерированное количество:', amount);
            
            const currentAmount = await getUserVodka(userId);
            console.log('Текущее количество:', currentAmount);
            
            const newTotal = await updateUserVodka(userId, amount, username);
            console.log('Новое количество:', newTotal);
            
            const message = getRandomMessage(amount, newTotal);
            await ctx.reply(message);
        } catch (error) {
            console.error('Ошибка в команде vodka:', error);
            await ctx.reply('Произошла ошибка при выполнении команды');
        }
    }
};