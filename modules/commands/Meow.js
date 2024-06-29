const axios = require('axios');
const request = require('request');
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "meow",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "See Neko",
    commandCategory: "Edit-IMG",
    usages: "meow [Text]",
    cooldowns: 1
};

module.exports.run = async function ({ api, event }) {
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    }

    try {
        const res = await axios.get('http://aws.random.cat/meow');
        const ext = res.data.file.substring(res.data.file.lastIndexOf(".") + 1);
        const filePath = path.join(__dirname, `cache/meow.${ext}`);

        const callback = () => {
            api.sendMessage({
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
        };

        request(res.data.file).pipe(fs.createWriteStream(filePath)).on("close", callback);
    } catch (error) {
        console.error("Error fetching and sending image:", error);
    }
};
