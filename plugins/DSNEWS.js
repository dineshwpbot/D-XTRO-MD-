const { cmd } = require('../command');
const Hiru = require('hirunews-scrap');
const Esana = require('@sl-code-lords/esana-news');
const config = require('../config');

async function getLatestNews() {
    let newsData = [];

    try {
        const hiruApi = new Hiru();
        const hiruNews = await hiruApi.BreakingNews();
        newsData.push({
            title: hiruNews.results.title,
            content: hiruNews.results.news,
            date: hiruNews.results.date,
            image: hiruNews.results.image
        });
    } catch (err) {
        console.error(`Error fetching Hiru News: ${err.message}`);
    }

    try {
        const esanaApi = new Esana();
        const esanaNews = await esanaApi.getLatestNews();
        if (esanaNews?.title) {
            newsData.push({
                title: esanaNews.title,
                content: esanaNews.description,
                date: esanaNews.publishedAt,
                image: esanaNews.image || ''
            });
        }
    } catch (err) {
        console.error(`Error fetching Esana News: ${err.message}`);
    }

    return newsData;
}

cmd({
    pattern: "startnews",
    desc: "Enable real-time news updates with preview",
    isGroup: true,
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, participants }) => {
    try {
        if (!isGroup) return conn.sendMessage(from, { text: "🚫 මෙම විධානය කණ්ඩායම් තුළ පමණි." });

        const isAdmin = participants.some(p => p.id === mek.sender && p.admin);
        if (!isAdmin) return conn.sendMessage(from, { text: "🚫 මෙම විධානය භාවිතා කළ හැක්කේ පරිපාලකයින්ට පමණි." });

        await conn.sendMessage(from, { text: "✅ *Auto News Activated.*\n\n> *QUEEN-SADU-MD*" });

        setInterval(async () => {
            const latestNews = await getLatestNews();

            for (const newsItem of latestNews) {
                // Coming News Message
                const previewMessage = await conn.sendMessage(from, {
                    text: "*🔵 Coming News...*\n\n> *QUEEN-SADU-MD*"
                });

                // Edit to Full News After 30 seconds
                setTimeout(async () => {
                    let fullMessage = {
                        text: `*🗞️ NEWS ALERT!*\n\n📰 *${newsItem.title}*\n\n${newsItem.content}\n\n📅 ${newsItem.date}\n\n> *Powered by MR DINESH OFC*`
                    };

                    if (newsItem.image) {
                        fullMessage['image'] = { url: newsItem.image };
                    }

                    // Edit the same message to show full news
                    await conn.sendMessage(from, fullMessage, { edit: previewMessage.key });
                }, 30000); // 30 seconds delay
            }
        }, 900000); // Check every 15 minutes

    } catch (err) {
        console.error(`Error in startnews: ${err.message}`);
    }
});
