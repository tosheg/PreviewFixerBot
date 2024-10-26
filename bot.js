require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { URL } = require('url');

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    try {
        // Prevent the bot from responding to its own messages or other bots
        if (msg.from.is_bot) return;

        const chatId = msg.chat.id;
        const messageText = msg.text;

        // Check if the message contains text
        if (!messageText) return;

        // Find URLs in the message
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = messageText.match(urlRegex);

        if (urls) {
            const modifiedLinks = [];

            for (let link of urls) {
                let parsedUrl;
                try {
                    parsedUrl = new URL(link);
                } catch (e) {
                    // Skip invalid URLs
                    continue;
                }

                let hostname = parsedUrl.hostname.toLowerCase();

                // For Instagram links
                if (hostname.endsWith('instagram.com')) {
                    parsedUrl.hostname = parsedUrl.hostname.replace(/^(.*\.)?instagram\.com$/, 'ddinstagram.com');
                    modifiedLinks.push(parsedUrl.toString());
                }
                // For TikTok links
                else if (hostname.endsWith('tiktok.com')) {
                    parsedUrl.hostname = parsedUrl.hostname.replace(/tiktok\.com$/, 'vxtiktok.com');
                    modifiedLinks.push(parsedUrl.toString());
                }
                // For Twitter/X links
                else if (hostname.endsWith('twitter.com') || hostname.endsWith('x.com')) {
                    parsedUrl.hostname = 'd.fxtwitter.com';
                    modifiedLinks.push(parsedUrl.toString());
                }
            }

            if (modifiedLinks.length > 0) {
                const message = modifiedLinks.map((link, index) => `<a href="${link}">link ${index + 1}</a>`).join('\n');
                await bot.sendMessage(chatId, message, {
                    parse_mode: 'HTML',
                    disable_web_page_preview: false,
                });
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});
