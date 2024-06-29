const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "kanna",
    version: "1.0.0",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "See pictures of baby dragons",
    commandCategory: "ramdom-images",
    usages: "kanna",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        try {
            axios.get('https://apikanna.khoahoang2.repl.co').then(res => {
                const ext = res.data.data.substring(res.data.data.lastIndexOf(".") + 1);
                const count = res.data.count;
                const callback = function () {
                    api.sendMessage({
                        body: `⚡️This is Kanna <3\n⚡️Number of photos available: ${count} Photo`,
                        attachment: fs.createReadStream(__dirname + `/cache/kanna.${ext}`)
                    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/kanna.${ext}`), event.messageID);
                };
                request(res.data.data).pipe(fs.createWriteStream(__dirname + `/cache/kanna.${ext}`)).on("close", callback);
            });
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while fetching the image.", event.threadID, event.messageID);
        }
    }
};
