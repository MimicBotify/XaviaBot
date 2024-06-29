const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "coin",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Check the amount of yourself or the person tagged",
    commandCategory: "economy",
    usages: "[Tag]",
    cooldowns: 5
};

module.exports.languages = {
    "vi": {
        "sotienbanthan": "Số tiền bạn đang có: %1$",
        "sotiennguoikhac": "Số tiền của %1 hiện đang có là: %2$"
    },
    "en": {
        "sotienbanthan": "Your current balance: %1$",
        "sotiennguoikhac": "%1's current balance: %2$."
    }
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (!args[0]) {
            const money = (await Currencies.getData(senderID)).money;
            return api.sendMessage(getText("sotienbanthan", money), threadID, messageID);
        } else if (Object.keys(event.mentions).length == 1) {
            var mention = Object.keys(mentions)[0];
            var money = (await Currencies.getData(mention)).money || 0;
            return api.sendMessage({
                body: getText("sotiennguoikhac", mentions[mention].replace(/\@/g, ""), money),
                mentions: [{
                    tag: mentions[mention].replace(/\@/g, ""),
                    id: mention
                }]
            }, threadID, messageID);
        } else {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
};
