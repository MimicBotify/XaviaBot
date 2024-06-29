const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "setemoji",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Đổi emoji trong nhóm",
    commandCategory: "Group",
    usages: "setemoji [emoji]",
    cooldowns: 3
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
        api.changeThreadEmoji(args.join(" "), event.threadID, event.messageID);
    }
    // Other command logic goes here
};
