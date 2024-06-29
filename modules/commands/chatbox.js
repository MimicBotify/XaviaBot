const fs = require('fs-extra');
const axios = require('axios');

module.exports.config = {
    name: "chatbox",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Send message to box or user",
    commandCategory: "Admin",
    usages: "chatbox",
    cooldowns: 5,
    dependencies: "",
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
        if (args.length < 2) {
            return api.sendMessage("Invalid arguments! Please provide the thread or user ID and the message.", threadID, messageID);
        }

        const id = args.shift(); // Extract the first argument as ID
        const text = args.join(" "); // Join the rest of the arguments as the message

        api.sendMessage(text, id);
    }
    //other command logic goes here
};
