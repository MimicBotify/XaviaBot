const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "fbget",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Download video or audio from fb",
    commandCategory: "utilities",
    usages: "audio/video [link]",
    cooldowns: 0
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
        try {
            if (args[0] == 'audio') {
                api.sendMessage(`Processing request!!!`, event.threadID, (err, info) => {
                    setTimeout(() => {
                        api.unsendMessage(info.messageID);
                    }, 20000);
                }, event.messageID);

                const path = __dirname + `/cache/2.mp3`;
                let getPorn = (await axios.get(event.attachments[0].playableUrl, { responseType: 'arraybuffer' })).data;
                fs.writeFileSync(path, Buffer.from(getPorn, "utf-8"));

                return api.sendMessage({
                    body: `Loaded success\n☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆`,
                    attachment: fs.createReadStream(path)
                }, event.threadID, () => fs.unlinkSync(path), event.messageID);
            } else if (args[0] == 'video') {
                api.sendMessage(`Processing request!!!`, event.threadID, (err, info) => {
                    setTimeout(() => {
                        api.unsendMessage(info.messageID);
                    }, 20000);
                }, event.messageID);

                const path1 = __dirname + `/cache/1.mp4`;
                let getPorn = (await axios.get(event.attachments[0].playableUrl, { responseType: 'arraybuffer' })).data;
                fs.writeFileSync(path1, Buffer.from(getPorn, "utf-8"));

                return api.sendMessage({
                    body: `Loaded success\n☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆`,
                    attachment: fs.createReadStream(path1)
                }, event.threadID, () => fs.unlinkSync(path1), event.messageID);
            }
        } catch {
            return api.sendMessage(`Unable to process the request`, event.threadID, event.messageID);
        }
    }
    // Other command logic goes here
};
