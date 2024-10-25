require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { URL } = require('url');

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    try {
        if (msg.from.is_bot) return;

        const chatId = msg.chat.id;
        const messageText = msg.text;

        if (!messageText) return;

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = messageText.match(urlRegex);

        if (urls) {
            urls.forEach((link) => {
                try {
                    let parsedUrl = new URL(link);
                    let hostname = parsedUrl.hostname.toLowerCase();
                    let pathname = parsedUrl.pathname.toLowerCase();

                    // For TikTok links
                    if (['vm.tiktok.com', 'vt.tiktok.com'].includes(hostname)) {
                        parsedUrl.hostname = hostname.replace('tiktok.com', 'vxtiktok.com');
                        sendModifiedLink(chatId, parsedUrl.toString());
                    }
                    // For Twitter/X links containing 'photo' or 'video'
                    else if (
                        ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'].includes(hostname) &&
                        (pathname.includes('/photo') || pathname.includes('/video'))
                    ) {
                        parsedUrl.hostname = 'd.fxtwitter.com';
                        sendModifiedLink(chatId, parsedUrl.toString());
                    }
                } catch (e) {
                    console.warn(`Invalid URL skipped: ${link}`, e.message);
                }
            });
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

function sendModifiedLink(chatId, newUrl) {
    const message = `<a href="${newUrl}">link</a>`;
    bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: false,
    });
}
