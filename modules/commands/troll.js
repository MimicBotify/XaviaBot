const fs = require('fs');
const axios = require('axios');
const request = global.nodemodule["request"];

module.exports.config = {
    name: "troll",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "",
    commandCategory: "image",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
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
        const text = args.join(" ");

        if (!text)
            return api.sendMessage("Add text lmao", event.threadID, event.messageID);

        const callback = () => api.sendMessage({ body: "", attachment: fs.createReadStream(__dirname + "/cache/biden.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/biden.png"), event.messageID);
        return request(encodeURI(`https://dalle-mini.amasad.repl.co/gen/${text}`)).pipe(fs.createWriteStream(__dirname + '/cache/biden.png')).on('close', () => callback());
    }
    // other command logic goes here
};
