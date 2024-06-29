const fs = require('fs');
const axios = require('axios');

// Exporting module
module.exports.config = {
    name: "job",
    version: "1.0.2",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "",
    commandCategory: "Economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 5000
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "You're done, come back later: %1 minute(s) %2 second(s)."
    }
};

const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const jobDetails = {
    work1: ['hiring staff', 'hotel administrator', 'at the power plant', 'restaurant chef', 'worker', 'rickshaw driver lol'],
    work2: ['plumber', 'neighbors air conditioner repair', 'multi-level sale', 'flyer distribution', 'shipper', 'computer repair', 'tour guide', 'breastfeeding'],
    work3: ['earn 13 barrels of oil', 'earn 8 barrels of oil', 'earn 9 barrels of oil', 'earn 8 barrels of oil', 'steal the oil', 'take water and pour it into oil and sell it'],
    work4: ['iron ore', 'gold ore', 'coal ore', 'lead ore', 'copper ore', 'oil ore'],
    work5: ['diamond', 'gold', 'coal', 'emerald', 'iron', 'ordinary stone', 'lazy', 'bluestone'],
    work6: ['vip guest', 'patent', 'stranger', '23-year-old fool', 'stranger', 'patron', '92-year-old tycoon', '12-year-old boyi']
};

module.exports.handleReply = async ({ event, api, Currencies }) => {
    const { threadID, senderID } = event;
    let data = (await Currencies.getData(senderID)).data || {};

    const { type, body } = event;

    const coinValues = {
        coinscn: getRandomValue(200, 600),
        coinsdv: getRandomValue(200, 1000),
        coinsmd: getRandomValue(200, 600),
        coinsq: getRandomValue(200, 800),
        coinsdd: getRandomValue(200, 400),
        coinsdd1: getRandomValue(200, 1000)
    };

    const workTypes = ['work1', 'work2', 'work3', 'work4', 'work5', 'work6'];

    switch (type) {
        case "choosee": {
            const chosenWork = jobDetails[workTypes[parseInt(body) - 1]];
            const earnedCoins = coinValues[`coins${workTypes[parseInt(body) - 1]}`];
            
            if (!chosenWork || !earnedCoins) return;
            
            const msg = `⚡️You are working ${chosenWork} and earn ${earnedCoins}$`;
            Currencies.increaseMoney(event.senderID, earnedCoins);
            
            api.unsendMessage(handleReply.messageID);
            
            return api.sendMessage(`${msg}`, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { data });
            });
        }
        default:
            break;
    }
};

module.exports.run = async ({ event, api, Currencies, getText }) => {
    const { threadID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (typeof data !== "undefined" && cooldown - (Date.now() - data.work2Time) > 0) {

            var time = cooldown - (Date.now() - data.work2Time),
                minutes = Math.floor(time / 60000),
                seconds = ((time % 60000) / 1000).toFixed(0); 
            return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), event.threadID, event.messageID);
        }
        else {   
    return api.sendMessage(
        "Coin Earn Job Center" +
        "\n\n1. work1" +
        "\n2. work2." +
        "\n3. work3." +
        "\n4. work4" +
        "\n5. work5" +
        "\n6. work6" +
        "\n7. Update soon..." +
        "\n\n⚡️Please reply to the message and choose by number", // Update case display here
        event.threadID,
        (error, info) => {
            data.work2Time = Date.now();
            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID
            })
        }
    );
}}};
