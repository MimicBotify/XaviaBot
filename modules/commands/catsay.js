const fs = require('fs');
const axios = require('axios');
const request = global.nodemodule["request"];

module.exports.config = {
    name: "catsay",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "",
    commandCategory: "edit-img",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const text = args.join(' ');

        if (!text)
            return api.sendMessage("[Text]", threadID, messageID);

        const callback = () => api.sendMessage({ body: "", attachment: fs.createReadStream(__dirname + "/cache/cat.png") }, threadID, () => fs.unlinkSync(__dirname + "/cache/cat.png"), messageID);

        return request(encodeURI(`https://cataas.com/cat/cute/says/${text}`))
            .pipe(fs.createWriteStream(__dirname + '/cache/cat.png'))
            .on('close', () => callback());
    }
};
