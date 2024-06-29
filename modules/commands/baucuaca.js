const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "baucuaca",
    version: "0.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Games",
    commandCategory: "games",
    usages: "baucuaca 500",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Currencies }) {
    const { threadID, messageID, senderID } = event;
    const slotItems = ["Vote", "Crab", "Fish"];
    let money = (await Currencies.getData(senderID)).money;
    const coin = parseInt(args[0]);

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (isNaN(coin) || coin <= 0) return api.sendMessage(`Invalid bet amount! Please enter a valid number greater than 0.`, threadID, messageID);
        if (coin > money) return api.sendMessage(`You don't have enough money for this bet.`, threadID, messageID);
        if (coin < 50) return api.sendMessage(`Your bet is too small, the minimum is $50!`, threadID, messageID);

        let number = [];
        for (let i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);

        let win = false;
        if (number[0] === number[1] && number[1] === number[2]) {
            money += coin * 9;
            win = true;
        } else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
            money += coin * 2;
            win = true;
        }

        const message = `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n${win ? "You have won!" : "You have lost!"}`;

        const updateMoney = win ? Currencies.increaseMoney : Currencies.decreaseMoney;
        updateMoney(senderID, win ? coin : -coin);

        return api.sendMessage(`${message}\nYour balance: ${money}`, threadID, messageID);
    }
};
