const fs = require('fs');
const axios = require('axios');

// module export goes here
module.exports.config = {
    name: "sad",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Just Respond",
    commandCategory: "no prefix",
    cooldowns: 5,
};

module.exports.handleEvent = function ({ api, event, client, __GLOBAL }) {
    var { threadID, messageID } = event;
    let react = event.body.toLowerCase();

    if (react.includes("sakit") || react.includes("saket") || react.includes("peyn") || react.includes("pain") || react.includes("mamatay") || react.includes("ayaw ko na") || react.includes("saktan") || react.includes("sad") || react.includes("malungkot") || react.includes("😥") || react.includes("😰") || react.includes("😨") || react.includes("😢") || react.includes(":(") || react.includes("😔") || react.includes("😞") || react.includes("depress") || react.includes("stress") || react.includes("kalungkutan") || react.includes("😭")) {
        var msg = {
            body: "Aally YAal roty ni na"
        };
        api.sendMessage(msg, threadID, messageID);
        api.setMessageReaction("😢", event.messageID, (err) => {}, true);
    }
};

module.exports.run = function ({ api, event, args, Currencies, getText }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        // Your command logic goes here
    }
};
