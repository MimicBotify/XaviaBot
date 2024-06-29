const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "antiout",
    version: "1.0.0",
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    hasPermssion: 1,
    description: "Turn on/off anti-out",
    usages: "antiout on/off",
    commandCategory: "system",
    cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let data = (await Threads.getData(threadID)).data || {};
        data["antiout"] = !data["antiout"];

        await Threads.setData(threadID, { data });
        global.data.threadData.set(parseInt(threadID), data);

        return api.sendMessage(`✅ Anti-out is now ${(data["antiout"] ? "enabled" : "disabled")}!`, threadID);
    }
    // Other command logic goes here
};
