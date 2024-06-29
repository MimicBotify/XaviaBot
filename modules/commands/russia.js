const fs = require('fs');
const axios = require('axios');
const request = require('request');

// Module export goes here
module.exports.config = {
    name: "russia",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Random ảnh Rushia",
    commandCategory: "random-img",
    usages: "russia",
    cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        axios.get('https://saikiapi-v3-production.up.railway.app/holo/rushia')
            .then(res => {
                let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
                let callback = function () {
                    api.sendMessage({
                        attachment: fs.createReadStream(__dirname + `/cache/rushia.${ext}`)
                    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/rushia.${ext}`), event.messageID);
                    api.setMessageReaction("✅", event.messageID, () => {}, true);
                };
                request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/rushia.${ext}`)).on("close", callback);
            })
            .catch(err => {
                api.sendMessage("There's something wrong while generating the photo, please try again!", event.threadID, event.messageID);
                api.setMessageReaction("☹️", event.messageID, () => {}, true);
            });
    }
    // Other command logic goes here
};
