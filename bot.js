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
                    // Log skipped invalid URLs for debugging
                    console.warn(`Skipping invalid URL: ${link}`, e.message);
                    continue;
                }

                let hostname = parsedUrl.hostname.toLowerCase();

                // For Instagram links
                if (hostname.includes('instagram.com')) {
                    parsedUrl.hostname = 'ddinstagram.com';  // Simplified replacement
                    const newUrl = parsedUrl.toString();
                    console.log(`Modified Instagram link: ${newUrl}`);  // Log the new URL
                    modifiedLinks.push(newUrl);
                }
                // For TikTok links
                else if (hostname.includes('tiktok.com')) {
                    parsedUrl.hostname = 'vxtiktok.com';  // Simplified replacement
                    const newUrl = parsedUrl.toString();
                    console.log(`Modified TikTok link: ${newUrl}`);  // Log the new URL
                    modifiedLinks.push(newUrl);
                }
                // For Twitter/X links
                else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
                    parsedUrl.hostname = 'd.fxtwitter.com';
                    const newUrl = parsedUrl.toString();
                    console.log(`Modified Twitter/X link: ${newUrl}`);  // Log the new URL
                    modifiedLinks.push(newUrl);
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
