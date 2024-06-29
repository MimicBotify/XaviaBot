const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "advice",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "advice but Tagalog",
    commandCategory: "game",
    usages: "advice",
    cooldowns: 0,
    dependencies: { "srod-v2": "", "request": "" }
};

module.exports.run = async ({ event, api, args }) => {
    const request = global.nodemodule["request"];
    const srod = global.nodemodule["srod-v2"];
    const Data = (await srod.GetAdvice()).embed.description;

    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tl&dt=t&q=${Data}`), (err, response, body) => {
            if (err) return api.sendMessage("Error", event.threadID, event.messageID);
            var retrieve = JSON.parse(body);
            var text = '';
            retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
            api.sendMessage(text, event.threadID, event.messageID);
        });
    }
    // other command logic goes here
};
