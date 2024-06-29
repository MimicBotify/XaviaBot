const fs = require('fs');
const axios = require('axios');

// Command configuration
module.exports.config = {
    name: "loto",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Random một con số bất kì trong một khoảng",
    commandCategory: "game",
    cooldowns: 5
};

// Command translations
module.exports.languages = {
    "vi": {
        "returnResultDefault": "%1 có lẽ là một con số may mắn :thinking:",
        "invalidMax": "Khoảng giới hạn số quay không hợp lệ",
        "invalidInput": "Khoảng bắt đầu hoặc khoảng kết thúc không phải là một con số hợp lệ!",
        "returnResult": "%1 có lẽ là một con số may mắn trong khoảng từ %2 đến %3 :thinking:"
    },
    "en": {
        "returnResultDefault": "%1 is maybe a lucky number :thinking:",
        "invalidMax": "invalid dial limit range",
        "invalidInput": "The started range or the ended range is not an invalid!",
        "returnResult": "%1 is nay e a lucky number in range from %2 to %3 :thinking:"
    }
};

// Command logic
module.exports.run = async function({ api, event, args, getText }) {
    const { threadID, messageID } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (args.length == 0) {
            return api.sendMessage(getText("returnResultDefault", Math.floor(Math.random() * 99)), threadID, messageID);
        }
        if (args.length != 2) {
            return api.sendMessage(getText("invalidMax"), threadID, messageID);
        }
        if (isNaN(args[0]) || isNaN(args[1]) || args[1] <= args[0] || args[0] < 0 || args[1] < 0) {
            return api.sendMessage(getText("invalidInput"), threadID, messageID);
        }

        return api.sendMessage(
            getText("returnResult", Math.floor(Math.random() * (args[1] - args[0] + 1) + args[0]), args[0], args[1]),
            threadID,
            messageID
        );
    }
    // other command logic goes here if needed
};
