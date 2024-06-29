const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "daily",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "earn botmoney",
    commandCategory: "economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 10800,
        rewardCoin: 9999999999999999
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "You received today's rewards, please come back after: %1 hours %2 minutes %3 seconds.",
        "rewarded": "You received %1$"
    }
};

module.exports.run = async function ({ api, event, Currencies, getText }) {
    const { threadID, senderID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, event.messageID);
    } else {
        const { daily } = global.configModule;
        const cooldownTime = daily.cooldownTime;
        const rewardCoin = daily.rewardCoin;

        let data = (await Currencies.getData(senderID)).data || {};
        if (typeof data !== "undefined" && cooldownTime - (Date.now() - (data.dailyCoolDown || 0)) > 0) {
            const time = cooldownTime - (Date.now() - data.dailyCoolDown);
            const seconds = Math.floor((time / 1000) % 60);
            const minutes = Math.floor((time / 1000 / 60) % 60);
            const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

            return api.sendMessage(getText("cooldown", hours, minutes, (seconds < 10 ? "0" : "") + seconds), threadID);
        } else {
            await api.sendMessage(getText("rewarded", rewardCoin), threadID);
            await Currencies.increaseMoney(senderID, rewardCoin);
            data.dailyCoolDown = Date.now();
            await Currencies.setData(senderID, { data });
            return;
        }
    }
};
