const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "fact",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "random facts",
    commandCategory: "...",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            const res = await axios.get(`https://api.popcat.xyz/fact`);
            const fact = res.data.fact;
            return api.sendMessage(`Did you know?>> ${fact}`, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while fetching the fact.", event.threadID, event.messageID);
        }
    }
    // other command logic goes here
}
