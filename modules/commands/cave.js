const fs = require('fs');

module.exports.config = {
    name: "cave",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Mine to earn money",
    commandCategory: "Make money",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 1000000
    }
};

module.exports.languages = {
    "vi": {
        "cooldown": "Bạn vừa chỉ mới làm nhiệm vụ, tránh bị mệt mỏi hãy quay lại sau: %1 phút %2 giây 🛏",
        "rewarded": "Bạn vừa thực hiện công việc: Cave và nhận được: %2$ 💸",
        "job1": "Hang động",
    },
    "en": {
        "cooldown": "You have worked today, to avoid exhaustion please come back after: %1 minute(s) %2 second(s).",
        "rewarded": "You did the job: Cave and received: %2$",
        "job1": "Cave",
    }
};

module.exports.run = async ({ event, api, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (typeof data !== "undefined" && cooldown - (Date.now() - data.workTime) > 0) {
            var time = cooldown - (Date.now() - data.workTime),
                minutes = Math.floor(time / 60000),
                seconds = ((time % 60000) / 1000).toFixed(0);
            
            return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), threadID, messageID);
        } else {
            const job = [
                getText("job1"),
            ];
            const amount = Math.floor(Math.random() * 10000);
            await Currencies.increaseMoney(senderID, parseInt(amount));
            data.workTime = Date.now();
            await Currencies.setData(senderID, { data });
            
            return api.sendMessage(getText("rewarded", job[Math.floor(Math.random() * job.length)], amount), threadID, messageID);
        }
    }
};
