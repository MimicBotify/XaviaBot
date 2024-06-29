const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "reminder",
    version: "0.0.1-beta",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Sets a reminder",
    commandCategory: "Countdown",
    usages: "[Time] [Text] ",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Users }) {
    const { threadID, messageID, senderID } = event;
    const time = parseInt(args.shift());
    const text = args.join(" ");

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (isNaN(time)) {
            return api.sendMessage(`How to use?\n${global.config.PREFIX}reminder <time> <txt>\n\nExample:\n${global.config.PREFIX}reminder 60 assignment make a powerful backend using NodeJs\n\nTake note:\n59 is equal to second\n60 is equal to minute to make a minute remind please use long numbers\n\nExample for minutes:\n${global.config.PREFIX}reminder 99999 <txt>\n99999 is equal to 16 minutes\n\nCeated by: Zia_Rein 100085021637694`, threadID, messageID);
        }

        const display = time > 59 ? `${time / 60} minute` : `${time} second`;
        await api.sendMessage(`I will remind you later\n ${display}`, threadID);

        await new Promise(resolve => setTimeout(resolve, time * 1000));

        let value = (await api.getThreadInfo(threadID)).nicknames[senderID] || (await Users.getInfo(senderID)).name;
        const body = text ? `${value},\n\n𝗿𝗲𝗺𝗶𝗻𝗱𝗲𝗿:\n${text}` : `${value}, I think you asked me to remind you to do something, right?`;

        await api.sendMessage({
            body,
            mentions: [{
                tag: value,
                id: senderID
            }]
        }, threadID);
    }
};
