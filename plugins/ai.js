const axios = require("axios");
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

cmd({
    pattern: "gpt",
    alias: "ai",
    desc: "Interact with ChatGPT using Sinhala voice.",
    category: "ai",
    react: "🤖",
    use: "<your query>",
    filename: __filename,
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("⚠️ කරුණාකර ප්‍රශ්නයක් ලබාදෙන්න.\n\nඋදාහරණය:\n.gpt AI කියන්නේ මොකක්ද?");

        const text = encodeURIComponent(q);
        
        // ChatGPT Sinhala reply
        const url = `https://api.dreaded.site/api/chatgpt?text=${text}&lang=si`;
        const response = await axios.get(url);

        if (!response.data || !response.data.result) {
            return reply("❌ GPT API වෙතින් පිළිතුරක් ලබාගත නොහැක.");
        }

        const gptResponse = response.data.result.prompt;
        
        // Voice (Sinhala Female Voice) generation
        const voiceUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(gptResponse)}&tl=si-LK`;
        const voicePath = path.join(__dirname, "gpt_sinhala_voice.mp3");
        const voiceResponse = await axios({
            method: 'get',
            url: voiceUrl,
            responseType: 'stream',
        });

        voiceResponse.data.pipe(fs.createWriteStream(voicePath));

        // Send Image + Sinhala GPT Reply + Voice
        const AI_IMAGE = 'https://i.postimg.cc/4y4Bxdc8/Picsart-25-02-08-23-56-16-217.jpg';
        const formattedInfo = `🤖 *ChatGPT පිළිතුර:* \n\n${gptResponse}`;

        await new Promise((resolve) => voiceResponse.data.on('end', resolve));

        await conn.sendMessage(from, {
            image: { url: AI_IMAGE },
            caption: formattedInfo,
            audio: { url: voicePath },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363357105376275@g.us@newsletter',
                    newsletterName: 'MR DINESH AI',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in GPT command:", error);
        reply("❌ දෝෂයක් සිදුවී ඇත. කරුණාකර නැවත උත්සාහ කරන්න.");
    }
});
