const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "noitu",
    version: "2.0.7",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Play with BOT or team members",
    commandCategory: "Entertainment",
    usages: "",
    cooldowns: 5
};

module.exports.onLoad = function () {
    if (typeof global.moduleData === "undefined") global.moduleData = {};
    if (typeof global.moduleData.noitu === "undefined") global.moduleData.noitu = new Map();
}

module.exports.handleEvent = async function ({ api, event }) {
    if (event.senderID === api.getCurrentUserID()) return;

    const axios = global.nodemodule["axios"];
    const { body: word, threadID, messageID } = event;

    if (global.moduleData.noitu.has(threadID)) {
        if (word && word.split(" ").length !== 2) return;

        try {
            const { data } = await axios.get("https://hoangdogianguyenofficial.herokuapp.com/linkword?word=" + encodeURIComponent(word));

            if (data.data.win === true) {
                global.moduleData.noitu.delete(threadID);
                return api.sendMessage("You won", threadID, messageID);
            }

            if (data.data.success === false) {
                global.moduleData.noitu.delete(threadID);
                return api.sendMessage("You lose", threadID, messageID);
            }
        } catch (error) {
            console.error(error);
        }
    }
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (!global.moduleData.noitu.has(threadID)) {
            global.moduleData.noitu.set(threadID);
            return api.sendMessage("Have turned on", threadID, messageID);
        } else {
            global.moduleData.noitu.delete(threadID);
            return api.sendMessage("Has turned off", threadID, messageID);
        }
    }
};
