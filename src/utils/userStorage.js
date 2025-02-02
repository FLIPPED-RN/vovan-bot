const { Sequelize } = require('sequelize');
const Vodka = require('../models/Vodka');
const sequelize = require('../config/database');

const COOLDOWN_HOURS = 24;
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

// Простое хранилище данных пользователей
const users = new Map();

module.exports = {
    // Получить количество чекушек пользователя
    getUserVodka: async (userId) => {
        try {
            console.log('Получаем данные для userId:', userId);
            const user = await Vodka.findByPk(userId);
            console.log('Получены данные:', user ? user.toJSON() : 'пользователь не найден');
            return user ? user.amount : 0;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return 0;
        }
    },
    
    checkCooldown: async (userId) => {
        try {
            const user = await Vodka.findByPk(userId);
            if (!user || !user.lastAttempt) {
                return { canAttempt: true, timeLeft: 0 };
            }

            const now = new Date();
            const lastAttempt = new Date(user.lastAttempt);
            const timePassed = now - lastAttempt;
            const timeLeft = COOLDOWN_MS - timePassed;

            return {
                canAttempt: timeLeft <= 0,
                timeLeft: Math.max(0, timeLeft)
            };
        } catch (error) {
            console.error('Ошибка при проверке времени:', error);
            return { canAttempt: false, timeLeft: COOLDOWN_MS };
        }
    },
    
    // Обновить количество чекушек пользователя
    updateUserVodka: async (userId, amount, username) => {
        try {
            console.log('Обновляем данные:', { userId, amount, username });
            
            let user = await Vodka.findByPk(userId);
            
            if (user) {
                const newAmount = user.amount + amount;
                await user.update({
                    amount: newAmount,
                    username: username,
                    lastAttempt: new Date()
                });
                console.log('Обновлены данные:', user.toJSON());
                return newAmount;
            } else {
                user = await Vodka.create({
                    userId: userId,
                    amount: amount,
                    username: username,
                    lastAttempt: new Date()
                });
                console.log('Созданы новые данные:', user.toJSON());
                return amount;
            }
        } catch (error) {
            console.error('Ошибка при обновлении данных:', error);
            throw error;
        }
    }
};