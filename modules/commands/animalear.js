const fs = require('fs');
const axios = require('axios');
const request = require('request'); // Import the 'request' module

module.exports.config = {
    name: "ear",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Animal Ear Waifu",
    commandCategory: "nsfw",
    usages: "ear",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        axios.get('https://RandomLinkAPI-1.ekekevan.repl.co/getlink4').then(res => {
            let callback = function () {
                api.sendMessage({
                    body: `Anime Girl w/Animal Ear`,
                    attachment: fs.createReadStream(__dirname + `/cache/anear.png`)
                }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/anear.png`), event.messageID);
            };
            request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/anear.png`)).on("close", callback);
        }).catch(err => {
            console.error("Error fetching image:", err);
            return api.sendMessage("An error occurred while fetching the image.", event.threadID, event.messageID);
        });
    }
};
