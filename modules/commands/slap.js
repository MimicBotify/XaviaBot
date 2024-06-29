module.exports.config = {
    name: "slap",
    version: "1.0.0",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Slap the friend tag",
    commandCategory: "general",
    usages: "slap [Tag someone you want to slap]",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (!args.join("")) {
            return api.sendMessage("Please tag someone", threadID, messageID);
        } else {
            return axios.get('https://api.satou-chan.xyz/api/endpoint/slap')
                .then(res => {
                    let getURL = res.data.url;
                    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
                    var mention = Object.keys(event.mentions)[0];
                    let tag = event.mentions[mention].replace("@", "");

                    let callback = function () {
                        api.setMessageReaction("✅", messageID, (err) => {}, true);
                        api.sendMessage({
                            body: "Slapped! " + tag + "\n\n*sorry, i thought there's mosquito*",
                            mentions: [{
                                tag: tag,
                                id: Object.keys(event.mentions)[0]
                            }],
                            attachment: fs.createReadStream(__dirname + `/cache/slap.${ext}`)
                        }, threadID, () => fs.unlinkSync(__dirname + `/cache/slap.${ext}`), messageID);
                    };
                    require('request')(getURL).pipe(fs.createWriteStream(__dirname + `/cache/slap.${ext}`)).on("close", callback);
                })
                .catch(err => {
                    api.sendMessage("Failed to generate gif, be sure that you've tagged someone!", threadID, messageID);
                    api.setMessageReaction("☹️", messageID, (err) => {}, true);
                });
        }
    }
};
