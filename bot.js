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
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|instagram\.com[^\s]*)/gi;
        const urls = messageText.match(urlRegex);

        if (urls) {
            const modifiedLinks = [];

            for (let link of urls) {
                // If the link does not start with http or https, prepend "https://"
                if (!/^https?:\/\//i.test(link)) {
                    link = 'https://' + link;
                }

                let parsedUrl;
                try {
                    parsedUrl = new URL(link);
                } catch (e) {
                    // Log skipped invalid URLs for debugging
                    console.warn(`Skipping invalid URL: ${link}`, e.message);
                    continue;
                }

                // Normalize the hostname to lowercase
                let hostname = parsedUrl.hostname.toLowerCase();

                // Normalize Instagram URLs without "www"
                if (hostname === 'instagram.com') {
                    parsedUrl.hostname = 'www.instagram.com';
                }

                // For Instagram links (including www.instagram.com)
                if (hostname.includes('instagram.com')) {
                    parsedUrl.hostname = 'ddinstagram.com';  // Modify hostname to ddinstagram.com
                    const newUrl = parsedUrl.toString();
                    console.log(`Modified Instagram link: ${newUrl}`);  // Log the new URL
                    modifiedLinks.push(newUrl);
                }
                // For TikTok links
                else if (hostname.includes('tiktok.com')) {
                    parsedUrl.hostname = parsedUrl.hostname.replace('tiktok.com', 'vxtiktok.com');
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
