const fs = require('fs-extra');
const axios = require('axios');

module.exports.config = {
    name: "slot",
    version: "1.0.1",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Coin throwing",
    commandCategory: "game-sp",
    usages: `Missing input\n\nHow to use?\n${global.config.PREFIX}slot <money>\n\nExample:\n${global.config.PREFIX}slot 100\n`,
    cooldowns: 5,
};

module.exports.languages = {
    "en": {
        "missingInput": `Missing input\n\nHow to use?\n${global.config.PREFIX}slot <money>\n\nExample:\n${global.config.PREFIX}slot 50\n\nCreated by: ZiaRein`,
        "moneyBetNotEnough": `You don't have enough money to check your balance please use ${global.config.PREFIX}money`,
        "limitBet": `Your bet is too low, the minimum is 50$\n\nExample:\n${global.config.PREFIX}slot 50`,
        "returnWin": "🎰 %1 | %2 | %3 🎰\nYou won with %4$",
        "returnLose": "🎰 %1 | %2 | %3 🎰\nYou lost and lost %4$"
    }
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;
    const { getData, increaseMoney, decreaseMoney } = Currencies;
    const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
    const moneyUser = (await getData(senderID)).money;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    }

    const moneyBet = parseInt(args[0]);
    if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage(getText("missingInput"), threadID, messageID);
    if (moneyBet > moneyUser) return api.sendMessage(getText("moneyBetNotEnough"), threadID, messageID);
    if (moneyBet < 50) return api.sendMessage(getText("limitBet"), threadID, messageID);

    const number = [];
    let win = false;

    for (let i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);

    if (number[0] == number[1] && number[1] == number[2]) {
        moneyBet *= 9;
        win = true;
    } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
        moneyBet *= 2;
        win = true;
    }

    if (win) {
        api.sendMessage(getText("returnWin", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], moneyBet), threadID, messageID);
        await increaseMoney(senderID, moneyBet);
    } else {
        api.sendMessage(getText("returnLose", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], moneyBet), threadID, messageID);
        await decreaseMoney(senderID, moneyBet);
    }
};
