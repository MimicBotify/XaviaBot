const fs = require('fs');
const axios = require('axios');

module.exports = {
    config: {
        name: "bruh",
        version: "1.0.1",
        hasPermssion: 0,
        credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
        description: "hihihihi",
        commandCategory: "Không cần dấu lệnh",
        usages: "Bủh",
        cooldowns: 5,
    },
    handleEvent: function ({ api, event, client, __GLOBAL }) {
        var { threadID, messageID } = event;
        let bot = global.config.OTHERBOT;

        const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
        const isActivated = activatedTokens.some(token => token.threadID === threadID);

        if (!isActivated) {
            return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
        } else {
            if ((event.body.indexOf("bruh") === 0 || event.body.indexOf("Bruh") === 0) && !bot.includes(event.senderID)) {
                var msg = {
                    body: "Bruh Bruuh",
                    attachment: fs.createReadStream(__dirname + `/noprefix/xxx.mp3`)
                };
                api.sendMessage(msg, threadID, messageID);
            }
        }
    },
    run: async function ({ api, event, args, Currencies, getText }) {
        const { threadID, messageID, senderID, mentions } = event;

        // Other command logic goes here
    }
};
