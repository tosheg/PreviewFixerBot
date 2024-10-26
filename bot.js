require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { URL } = require('url');

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

        // Find URLs in the message
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = messageText.match(urlRegex);

        if (urls) {
            for (let link of urls) {
                let parsedUrl;
                try {
                    parsedUrl = new URL(link);
                } catch (e) {
                    // Skip invalid URLs
                    continue;
                }

                let hostname = parsedUrl.hostname.toLowerCase();
                let pathname = parsedUrl.pathname.toLowerCase();

                // For Instagram links
                if (hostname === 'instagram.com' || hostname === 'www.instagram.com') {
                    // Modify the hostname to 'ddinstagram.com'
                    parsedUrl.hostname = 'ddinstagram.com';
                    let newUrl = parsedUrl.toString();

                    // Prepare the message with the hyperlink
                    const message = `<a href="${newUrl}">link</a>`;
                    bot.sendMessage(chatId, message, {
                        parse_mode: 'HTML',
                        disable_web_page_preview: false,
                    });
                }
                // For TikTok links (vm.tiktok.com or vt.tiktok.com)
                else if (hostname === 'vm.tiktok.com' || hostname === 'vt.tiktok.com') {
                    // Modify the hostname by replacing 'tiktok.com' with 'vxtiktok.com'
                    parsedUrl.hostname = hostname.replace('tiktok.com', 'vxtiktok.com');
                    let newUrl = parsedUrl.toString();

                    // Prepare the message with the hyperlink
                    const message = `<a href="${newUrl}">link</a>`;
                    bot.sendMessage(chatId, message, {
                        parse_mode: 'HTML',
                        disable_web_page_preview: false,
                    });
                }
                // For Twitter links
                else if (
                    hostname === 'twitter.com' ||
                    hostname === 'www.twitter.com' ||
                    hostname === 'x.com' ||
                    hostname === 'www.x.com'
                ) {
                    // Check if path contains 'photo' or 'video'
                    if (pathname.includes('/photo') || pathname.includes('/video')) {
                        // Add 'd.' before 'fxtwitter.com'
                        parsedUrl.hostname = 'd.fxtwitter.com';
                        let newUrl = parsedUrl.toString();

                        // Prepare the message with the hyperlink
                        const message = `<a href="${newUrl}">link</a>`;
                        bot.sendMessage(chatId, message, {
                            parse_mode: 'HTML',
                            disable_web_page_preview: false,
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});