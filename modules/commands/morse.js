const fs = require('fs');
const axios = require('axios');
const morsify = require('morse-decoder');

module.exports.config = {
    name: "morse",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Encrypt and decrypt morse code",
    commandCategory: "Tool",
    usages: "morse [encode or decode] [Text ASCII to encrypt]",
    cooldowns: 5,
    dependencies: {
        "morse-decoder": ""
    }
};

module.exports.run = function({ api, event, args }) {
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        try {
            const content = args.join(" ");

            if (event.type === "message_reply") {
                const replyContent = event.messageReply.body;
                if (content.indexOf('en') === 0) {
                    return api.sendMessage(morsify.encode(replyContent), event.threadID, event.messageID);
                } else if (content.indexOf('de') === 0) {
                    return api.sendMessage(morsify.decode(replyContent), event.threadID, event.messageID);
                } else {
                    return api.sendMessage(`Wrong syntax, please find out more at ${prefix}help ${'morse'}`, event.threadID, event.messageID);
                }
            } else {
                if (content.indexOf('en') === 0) {
                    return api.sendMessage(morsify.encode(content.slice(3)), event.threadID, event.messageID);
                } else if (content.indexOf('de') === 0) {
                    return api.sendMessage(morsify.decode(content.slice(3)), event.threadID, event.messageID);
                } else {
                    return api.sendMessage(`Wrong syntax, please find out more at ${prefix}help ${'morse'}`, event.threadID, event.messageID);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            return api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
        }
    }
};
