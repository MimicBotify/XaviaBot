const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "automention",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "automent [mentioned]",
    commandCategory: "other",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID, mentions } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (Object.keys(event.mentions).length === 0) {
            return api.sendMessage(`@[${event.senderID}:0]`, event.threadID, event.messageID);
        } else {
            Object.keys(event.mentions).forEach(key => {
                const mentionedUser = Object.values(event.mentions)[key].replace('@', '');
                const mentionedUserID = Object.keys(event.mentions)[key];
                api.sendMessage(`${mentionedUser}: @[${mentionedUserID}:0]`, event.threadID);
            });
        }
    }
    //other command logic goes here
};
