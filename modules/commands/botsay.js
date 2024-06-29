const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "botsay",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Bot Saying",
    commandCategory: "ai",
    usages: "[text/message/chat]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        var say = args.join(" ");

        if (!say) {
            api.sendMessage("Please enter a message", event.threadID, event.messageID);
        } else {
            api.sendMessage(`${say}`, event.threadID, event.messageID);
        }
        // Other command logic goes here if needed
    }
};
