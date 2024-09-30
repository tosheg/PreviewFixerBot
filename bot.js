require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    try {
        // Prevent the bot from responding to its own messages or other bots
        if (msg.from.is_bot) return;

        const chatId = msg.chat.id;
        const messageText = msg.text;

        // Check if the message contains text
        if (!messageText) return;

        let updatedMessage = messageText;

        // Replace Instagram links with ddinstagram.com
        updatedMessage = updatedMessage.replace(
            /https?:\/\/(www\.)?instagram\.com\//g,
            'https://ddinstagram.com/'
        );

        // Replace x.com and twitter.com links with fixupx.com
        updatedMessage = updatedMessage.replace(
            /https?:\/\/(www\.)?(x\.com|twitter\.com)\//g,
            'https://fixupx.com/'
        );

        // If changes were made, send the updated message
        if (updatedMessage !== messageText) {
            bot.sendMessage(chatId, updatedMessage);
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});
