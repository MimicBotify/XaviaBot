const fs = require('fs');
const axios = require('axios');
const request = global.nodemodule["request"];
const fsExtra = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "kissv4",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "Kiss the friend tag",
  commandCategory: "anime",
  usages: "kiss [Tag someone you need Kissing]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fsExtra.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    const out = (msg) => api.sendMessage(msg, threadID, messageID);

    if (!isActivated) {
        return out("Group is not activated. Please activate the group to use the command.");
    }

    if (!args.join("")) {
        return out("Please tag someone");
    }

    try {
        const res = await axios.get('https://api.satou-chan.xyz/api/endpoint/kiss');
        const ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
        const mention = Object.keys(event.mentions)[0];
        const tag = event.mentions[mention].replace("@", "");

        const callback = () => {
            api.setMessageReaction("✅", messageID, () => {}, true);
            api.sendMessage({
                body: `${tag}, I love you very much ❤️`,
                mentions: [{
                    tag: tag,
                    id: Object.keys(event.mentions)[0]
                }],
                attachment: fs.createReadStream(__dirname + `/cache/kiss.${ext}`)
            }, threadID, () => fs.unlinkSync(__dirname + `/cache/kiss.${ext}`), messageID);
        };

        request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/kiss.${ext}`)).on("close", callback);
    } catch (err) {
        api.sendMessage("Failed to generate gif, be sure that you've tagged someone!", threadID, messageID);
        api.setMessageReaction("☹️", messageID, () => {}, true);
    }
};
