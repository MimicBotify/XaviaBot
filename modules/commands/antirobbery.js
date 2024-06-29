const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "antirobbery",
    version: "1.0.0",
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    hasPermssion: 1,
    description: "Prevent changing group administrators",
    usages: "",
    commandCategory: "Box Chat",
    cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const info = await api.getThreadInfo(threadID);
        if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) {
            return api.sendMessage('This command requires group administrator permissions. Please add and try again!', threadID, messageID);
        }

        let data = (await Threads.getData(threadID)).data || {};
        data["guard"] = !data["guard"];

        await Threads.setData(threadID, { data });
        global.data.threadData.set(parseInt(threadID), data);

        return api.sendMessage(`${(data["guard"] ? "Enabled" : "Disabled")} Anti-Robbery Group successfully!`, threadID, messageID);
    }
    // Other command logic goes here
};
