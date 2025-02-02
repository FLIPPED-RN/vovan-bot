module.exports = {
    command: 'help',
    description: 'Показать список команд',
    execute: async (ctx) => {
        await ctx.reply(
            'Доступные команды:\n' +
            '/start - Начать работу\n' +
            '/help - Показать это сообщение\n' +
            '/vodka - Попытаться спиздить чекушки у дяди Вовы\n' +
            '/mystash - Проверить свой запас чекушек\n' +
            '/top - Показать топ-10 алкашей'
        );
    }
};