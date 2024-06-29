const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "fact2",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "",
    commandCategory: "image",
    usages: "text",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
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
        try {
            let text = args.toString().replace(/,/g,  '  ');
            if (!text) {
                return api.sendMessage("Add text lmao", event.threadID, event.messageID);
            }
            const callback = () => api.sendMessage({ body: ``, attachment: fs.createReadStream(__dirname + "/cache/biden.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/biden.png"), event.messageID);
            return request(encodeURI(`https://api.popcat.xyz/facts?text=${text}`)).pipe(fs.createWriteStream(__dirname+'/cache/biden.png')).on('close',() => callback());
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while fetching the fact.", event.threadID, event.messageID);
        }
    }
    // other command logic goes here
};
