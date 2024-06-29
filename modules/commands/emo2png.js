const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "emotopng",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Gaming Logo maker",
    commandCategory: "Utilities",
    usages: "[text]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        var tip = args.join(" ");

        if (!tip) return api.sendMessage(`add text lmao`, event.threadID, event.messageID);
        else {
            axios.get(`https://leyscoders-api.herokuapp.com/api/emoji-pngv2?emoji=${tip}&apikey=MIMINGANZ`).then(res => {
                var url = res.data.result.facebook;
                let callback = function () {
                    api.sendMessage({
                        attachment: fs.createReadStream(__dirname + `/cache/banner.png`)
                    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/banner.png`), event.messageID);
                };
                request(encodeURI(url)).pipe(fs.createWriteStream(__dirname + `/cache/banner.png`)).on("close", callback);
            });
        }
        //other command logic goes here
    }
}
