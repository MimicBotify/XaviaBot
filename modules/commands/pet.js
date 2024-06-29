const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "pet",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Pat the friend tag",
    commandCategory: "anime",
    usages: "pat [Tag someone you want to pat]",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
        if (!args.join("")) return out("Please tag someone");
        else {
            return axios.get('https://api.satou-chan.xyz/api/endpoint/pat')
                .then(res => {
                    let getURL = res.data.url;
                    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
                    var mention = Object.keys(event.mentions)[0];
                    let tag = event.mentions[mention].replace("@", "");

                    let callback = function () {
                        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
                        api.sendMessage({
                            body: "Pats, " + tag + ". Yosh yosh!",
                            mentions: [{
                                tag: tag,
                                id: Object.keys(event.mentions)[0]
                            }],
                            attachment: fs.createReadStream(__dirname + `/cache/pat.${ext}`)
                        }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/pat.${ext}`), event.messageID)
                    };
                    request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/pat.${ext}`)).on("close", callback);
                })
                .catch(err => {
                    api.sendMessage("Failed to generate gif, be sure that you've tagged someone!", event.threadID, event.messageID);
                })
        }
        // Other command logic goes here if needed
    }
}
