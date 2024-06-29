const fs = require('fs-extra');
const axios = require('axios');
const moment = require('moment-timezone');

module.exports.config = {
    name: "sleep",
    version: "1.0.1",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Calculate the perfect bedtime for you",
    commandCategory: "health",
    usages: "[Time]",
    cooldowns: 5,
    dependencies: {
        "moment-timezone": ""
    }
};

module.exports.run = async function({ api, event, args, getText }) {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);
    
    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let wakeTime = [];
        let content = args.join(" ");
        
        if (!content) {
            for (let i = 1; i < 7; i++) {
                wakeTime.push(moment().tz("Asia/Dhaka").add(90 * i + 15, 'm').format("HH:mm"));
            }
            return api.sendMessage(getText("returnTimeNow", wakeTime.join(', ')), threadID, messageID);
        } else {
            if (content.indexOf(":") === -1) {
                return global.utils.throwError(this.config.name, threadID, messageID);
            }
            const [contentHour, contentMinute] = content.split(":");
            if (isNaN(contentHour) || isNaN(contentMinute) || contentHour > 23 || contentMinute > 59 || contentHour < 0 || contentMinute < 0 || contentHour.length !== 2 || contentMinute.length !== 2) {
                return global.utils.throwError(this.config.name, threadID, messageID);
            }
            const getTime = moment().tz("Asia/Dhaka").format();
            const time = getTime.slice(getTime.indexOf("T") + 1, getTime.indexOf("+"));
            const hour = time.split(":")[0];
            const minute = time.split(":")[1];
            const sleepTime = getTime.replace(hour + ":", contentHour + ":").replace(minute + ":", contentMinute + ":");
            
            for (let i = 1; i < 7; i++) {
                wakeTime.push(moment(sleepTime).tz("Asia/Dhaka").add(90 * i + 15, 'm').format("HH:mm"));
            }
            return api.sendMessage(getText("returnTimeSet", content, wakeTime.join(', ')), threadID, messageID);
        }
    }
}
