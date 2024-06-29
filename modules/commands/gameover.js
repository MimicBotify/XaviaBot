const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "gameover",
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

module.exports.run = async ({ api, event, args }) => {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];

    const { threadID, messageID, senderID } = event;
    let text = args.join(' ');

    if (!text) {
        return api.sendMessage("Add text lmao", event.threadID, event.messageID);
    }

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    }

    const callback = () => {
        api.sendMessage({ body: '', attachment: fs.createReadStream(__dirname + "/cache/biden.png") }, threadID, () => {
            fs.unlinkSync(__dirname + "/cache/biden.png");
        }, messageID);
    };

    request(encodeURI(`https://caliphapi.com/api/textpro/gameover?text=PLAY&text2=${text}&apikey=7z7fKcNE`))
        .pipe(fs.createWriteStream(__dirname + '/cache/biden.png'))
        .on('close', () => callback());
};
