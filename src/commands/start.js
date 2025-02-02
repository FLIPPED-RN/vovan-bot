module.exports = {
    command: 'start',
    description: 'Начать работу с ботом',
    execute: async (ctx) => {
        await ctx.reply('Привет! Я бот с командами. Используй /help для списка команд.');
    }
}; 