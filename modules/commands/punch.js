const fs = require('fs');
const axios = require('axios');
const request = require('request');

// Module export goes here
module.exports.config = {
    name: "punch",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Punch the friend tag",
    commandCategory: "general",
    usages: "punch [Tag someone you want to punch]",
    cooldowns: 5,
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
        const out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
        if (!args.join("")) return out("Please tag someone");
        
        return axios.get('https://api.satou-chan.xyz/api/endpoint/punch')
            .then(res => {
                let getURL = res.data.url;
                let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
                const mention = Object.keys(event.mentions)[0];
                let tag = event.mentions[mention].replace("@", "");

                const callback = function () {
                    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
                    api.sendMessage({
                        body: "Ora ora ora! " + tag,
                        mentions: [{
                            tag: tag,
                            id: Object.keys(event.mentions)[0]
                        }],
                        attachment: fs.createReadStream(__dirname + `/cache/punch.${ext}`)
                    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/punch.${ext}`), event.messageID);
                };
                
                request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/punch.${ext}`)).on("close", callback);
            })
            .catch(err => {
                api.sendMessage("Failed to generate gif, be sure that you've tagged someone!", event.threadID, event.messageID);
                api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
            });
    }
    // Other command logic goes here
};
