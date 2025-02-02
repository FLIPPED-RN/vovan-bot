const { Markup } = require('telegraf');

const groupOnly = async (ctx, next) => {
    // Разрешаем команды start и help в любом чате
    if (ctx.message?.text && (ctx.message.text.startsWith('/start') || ctx.message.text.startsWith('/help'))) {
        return next();
    }
    
    // Проверяем, является ли чат группой или супергруппой
    if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
        return next();
    }
    
    // Если это личный чат, отправляем сообщение с кнопкой
    await ctx.reply(
        'Дядя Вова сказал, что этот бот работает только в групповых чатах! 👨',
        Markup.inlineKeyboard([
            [Markup.button.url('Добавить бота в группу', 'https://t.me/' + ctx.botInfo.username + '?startgroup=true')]
        ])
    );
};

module.exports = groupOnly; 