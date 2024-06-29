const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "betv2",
    version: "0.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Games",
    commandCategory: "games",
    usages: "rdi 500",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let { threadID, messageID, senderID } = event;
        const cointt = `100$`;
        const slotItems = ["🚀", "⏳", "👓", "🔦", "💡", "🕯️", "🥽", "🎲", "🔥", "🔔", "🏺", "🍆", "🐣"];
        let money = (await Currencies.getData(event.senderID)).money;
        var coin = args.join(" ");

        if (!coin) return api.sendMessage(`You have not entered the bet amount!`, threadID, messageID);
        let win = false;
        if (isNaN(coin) || coin.indexOf("-") !== -1) return api.sendMessage(`Your bet amount is not a number, please review usage at ${prefix}help baucuaca`, threadID, messageID);
        if (coin > money) return api.sendMessage(`Your amount is not enough`, threadID, messageID);
        if (coin < 100) return api.sendMessage(`Your bet amount is too small, the minimum is ${cointt}!`, threadID, messageID);

        let number = [];
        for (i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);

        if (number[0] == number[1] && number[1] == number[2]) {
            money *= 9;
            win = true;
        } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
            money *= 2;
            win = true;
        }

        (win) ? api.sendMessage(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\nYou won\nReceive ${coin} dollar.`, threadID, () => Currencies.increaseMoney(senderID, parseInt(coin)), messageID) : api.sendMessage(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}|\nYou lose\nAmount of money ${coin} dollars will lose!.`, threadID, () => Currencies.decreaseMoney(senderID, parseInt(coin)), messageID);
    }
    //other command logic goes here
};
