const fs = require('fs');
const axios = require('axios');
module.exports.config = {
	name: "work",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
	description: "If you work, you can eat!",
	commandCategory: "Earn money",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 1200000
    }
};

module.exports.languages = {
    "vi": {
        "cooldown": "Bạn đã làm công việc hôm nay, để tránh kiệt sức hãy quay lại sau: %1 phút %2 giây.",
        "rewarded": "Bạn đã làm công việc %1 và kiếm ra được %2$",
        "job1": "bán vé số",
        "job2": "sửa xe",
        "job3": "lập trình",
        "job4": "hack facebook",
        "job5": "đầu bếp",
        "job6": "thợ hồ",
        "job7": "fake taxi",
        "job8": "gangbang người nào đó",
        "job9": "thợ sửa ống nước may mắn  ( ͡° ͜ʖ ͡°)",
        "job10": "streamer",
        "job11": "bán hàng trực tuyến",
        "job12": "nội trợ",
        "job13": 'bán "hoa"',
        "job14": "tìm jav/hentai code cho SpermLord",
        "job15": "chơi Yasuo và gánh đội của bạn"
    },
    "en": {
        "cooldown": "You have worked today, to avoid exhaustion please come back after: %1 minute(s) %2 second(s).",
        "rewarded": "You did the job: %1 and received: %2$.",
        "job1": "sell lottery tickets",
        "job2": "repair car",
        "job3": "programming",
        "job4": "hack Facebook",
        "job5": "chef",
        "job6": "mason",
        "job7": "fake taxi",
        "job8": "gangbang someone",
        "job9": "plumber ( ͡° ͜ʖ ͡°)",
        "job10": "streamer",
        "job11": "online seller",
        "job12": "housewife",
        "job13": 'sell "flower"',
        "job14": "find jav/hentai code for SpermLord",
        "job15": "play Yasuo and carry your team"
    }
}


module.exports.run = async function({ api, event, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let data = (await Currencies.getData(senderID)).data || {};

        if (typeof data !== "undefined" && data.workTime && Date.now() - data.workTime < global.configModule.work.cooldownTime) {
            const timeLeft = global.configModule.work.cooldownTime - (Date.now() - data.workTime);
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = ((timeLeft % 60000) / 1000).toFixed(0);
            const formattedTimeLeft = `${minutes} minute(s) ${seconds < 10 ? '0' + seconds : seconds} second(s)`;

            return api.sendMessage(getText("cooldown", minutes, seconds), threadID, messageID);
        } else {
            const jobs = [
                
                    getText("job1"),
                    getText("job2"),
                    getText("job3"),
                    getText("job4"),
                    getText("job5"),
                    getText("job6"),
                    getText("job7"),
                    getText("job8"),
                    getText("job9"),
                    getText("job10"),
                    getText("job11"),
                    getText("job12"),
                    getText("job13"),
                    getText("job14"),
                    getText("job15")
            ];
            const amountEarned = Math.floor(Math.random() * 600);

            const randomJob = jobs[Math.floor(Math.random() * jobs.length)];

            return api.sendMessage(getText("rewarded", randomJob, amountEarned), threadID, async () => {
                await Currencies.increaseMoney(senderID, parseInt(amountEarned));
                data.workTime = Date.now();
                await Currencies.setData(senderID, { data });
                return;
            }, messageID);
        }
    }
    // Other command logic goes here...
};
