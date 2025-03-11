const { default: makeWASocket, proto, generateWAMessageFromContent, prepareWAMessageMedia } = require('@adiwajshing/baileys');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'alive',
    description: 'Check if the bot is alive',
    execute: async (sock, msg, args) => {
        const jid = msg.key.remoteJid;

        // Text message
        const textMessage = {
            text: '👋 Hello! I am alive and ready to assist you.',
            footer: 'Your friendly bot',
            buttons: [
                { buttonId: 'ping', buttonText: { displayText: 'Ping' }, type: 1 },
                { buttonId: 'menu', buttonText: { displayText: 'Menu' }, type: 1 }
            ],
            headerType: 1
        };

        // Voice message
        const voicePath = path.resolve(__dirname, 'media/voice_note.opus'); // Replace with the path to your voice note
        const voiceBuffer = fs.readFileSync(voicePath);
        const voiceMessage = await prepareWAMessageMedia({ audio: voiceBuffer, mimetype: 'audio/ogg; codecs=opus' }, { upload: sock.waUploadToServer });

        // Combine text and voice messages
        const combinedMessage = {
            ...textMessage,
            ...voiceMessage
        };

        // Send the combined message
        await sock.sendMessage(jid, combinedMessage);
    }
};
