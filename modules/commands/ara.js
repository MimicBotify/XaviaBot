const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "araara",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "hihihihi",
    commandCategory: "no prefix",
    usages: "araara",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let bot = global.config.OTHERBOT;
        let body = event.body.toLowerCase();
        if ((body.startsWith("ara ara") || body.startsWith("ara")) && !bot.includes(senderID)) {
            const msg = {
                body: "Ara ara~",
                attachment: fs.createReadStream(__dirname + `/noprefix/ara.mp3`)
            };
            api.sendMessage(msg, threadID, messageID, (err, info) => {
                if (!err) {
                    api.setMessageReaction("😍", info.messageID);
                }
            });
        }
    }
    // Other command logic goes here
};
