const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "tid",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "group id",
    commandCategory: "box",
    usages: "tid",
    cooldowns: 5,
    dependencies: '',
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        api.sendMessage(`Current Thread ID: ${threadID}`, threadID, messageID);
    }
};
