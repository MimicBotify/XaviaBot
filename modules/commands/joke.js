const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "joke",
    version: "1.0.0",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "funny",
    commandCategory: "quotes",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        try {
            const res = await axios.get(`https://api.popcat.xyz/joke`);
            const joke = res.data.joke;
            return api.sendMessage(`${joke}`, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while fetching the joke.", event.threadID, event.messageID);
        }
    }
};
