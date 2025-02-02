const Vodka = require('../models/Vodka');

module.exports = {
    command: 'top',
    description: 'Показать топ-10 алкашей',
    execute: async (ctx) => {
        const users = await Vodka.findAll({
            order: [['amount', 'DESC']],
            limit: 10
        });

        if (users.length === 0) {
            return ctx.reply('Пока никто не накопил чекушек! Будь первым 😉');
        }

        const topList = users
            .map((user, index) => {
                const username = user.username ? `@${user.username}` : 'Анонимный алкаш';
                return `${index + 1}. ${username}: ${user.amount} чекушек`;
            })
            .join('\n');

        await ctx.reply(`🏆 Топ-10 алкашей:\n\n${topList}`);
    }
}; 