const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "reverse",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Reverse text",
    usages: "[text]",
    commandCategory: "...",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const text = args.join(" ");
        const res = await axios.get(`https://api-toxic-devil.herokuapp.com/api/reverse-text?text=${text}`);
        const reversedText = res.data.result.reversedText;
        return api.sendMessage(`${reversedText}`, threadID, messageID);
    }
};
