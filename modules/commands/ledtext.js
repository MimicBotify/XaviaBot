const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "ledtext",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Led Text",
    commandCategory: "Utilities",
    usages: "[text]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const tip = args.join(" ");
        if (!tip) {
            return api.sendMessage(`Please add text to convert to LED text.`, threadID, messageID);
        } else {
            axios.get(`https://sanuw-api.herokuapp.com/docs/textpro/led-text?text=${tip}&apikey=sanuwa`).then(res => {
                const url = res.data.url;
                const callback = () => {
                    api.sendMessage({ attachment: fs.createReadStream(__dirname + `/cache/banner.png`) }, threadID, () => fs.unlinkSync(__dirname + `/cache/banner.png`), messageID);
                };
                request(encodeURI(url)).pipe(fs.createWriteStream(__dirname + `/cache/banner.png`)).on("close", callback);
            }).catch(err => {
                console.error(err);
                api.sendMessage("Failed to generate LED text. Please try again later.", threadID, messageID);
            });
        }
    }
    // other command logic goes here
};
