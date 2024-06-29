const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "eve",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Just Respond",
    commandCategory: "no prefix",
    cooldowns: 5,
};

module.exports.handleEvent = async function ({ api, event, client, Users, __GLOBAL }) {
    var { threadID, messageID } = event;
    var name = await Users.getNameUser(event.senderID);

    if (event.body.indexOf("good eve") == 0 || event.body.indexOf("Good eve") == 0 || event.body.indexOf("good Eve") == 0 || event.body.indexOf("Good Eve") == 0 || event.body.indexOf("eve") == 0 || event.body.indexOf("Eve") == 0 || event.body.indexOf("magandang gabi") == 0 || event.body.indexOf("Magandang gabi") == 0 || event.body.indexOf("magandang Gabi") == 0 || event.body.indexOf("Magandang Gabi") == 0) {
        var msg = {
            body: `Good Evening ${name} ❤️`
        }
        api.sendMessage(msg, threadID, messageID);
        api.setMessageReaction("❤️", event.messageID, (err) => {}, true)
    }
}

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        // Other command logic goes here
    }
}
