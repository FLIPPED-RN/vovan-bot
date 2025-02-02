const { getUserVodka } = require('../utils/userStorage');

module.exports = {
    command: 'mystash',
    description: 'Проверить свой запас чекушек',
    execute: async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            console.log('Команда mystash от пользователя:', userId);
            
            const amount = await getUserVodka(userId);
            console.log('Получено количество:', amount);
            
            await ctx.reply(`У вас в заначке ${amount} чекушек 🍾`);
        } catch (error) {
            console.error('Ошибка в команде mystash:', error);
            await ctx.reply('Произошла ошибка при проверке заначки');
        }
    }
}; 