const fs = require('fs');
const axios = require('axios');
const moment = require('moment-timezone');

module.exports.config = {
    name: "autoreset",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "AUTO RESTART",
    commandCategory: "System",
    cooldowns: 5
};

module.exports.handleEvent = async function({ api, event, args, Users, Threads }) {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
        const idad = global.config.ADMINBOT;

        const restartTimes = [
            "12:00:00", "11:00:00", "10:00:00", "09:00:00", "08:00:00", "07:00:00",
            "06:00:00", "05:00:00", "04:00:00", "03:00:00", "02:00:00", "01:00:00"
        ];

        if (restartTimes.includes(timeNow) && moment().seconds() < 6) {
            for (let ad of idad) {
                setTimeout(() => api.sendMessage(`⚡️Now it's: ${timeNow}\nBot will restart!!!`, ad, () => process.exit(1)), 1000);
            }
        }
    }
};

module.exports.run = async function({ api, event }) {
    const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
    api.sendMessage(`${timeNow}`, event.threadID);
    // Other command logic goes here if needed
};
