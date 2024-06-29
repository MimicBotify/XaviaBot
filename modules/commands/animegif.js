const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "gifanime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "random gif anime",
    commandCategory: "anime",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        axios.get('https://saikiapi-production.up.railway.app/x/anime?apikey=saiki827')
            .then(res => {
                const { url } = res.data;
                const ext = url.substring(url.lastIndexOf(".") + 1);
                const callback = function () {
                    api.sendMessage({
                        body: `🌸Number of photos available: 30 Photos`,
                        attachment: fs.createReadStream(__dirname + `/cache/violet.${ext}`)
                    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/violet.${ext}`), event.messageID);
                    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
                };
                request(url).pipe(fs.createWriteStream(__dirname + `/cache/violet.${ext}`)).on("close", callback);
            })
            .catch(err => {
                api.sendMessage("There's a problem while generating the photo, please try again!", event.threadID, event.messageID);
                api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
            });
    }
    // other command logic goes here
}
