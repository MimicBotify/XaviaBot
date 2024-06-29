const fs = require('fs');
const axios = require('axios');
const request = global.nodemodule["request"];

module.exports.config = {
    name: "trans",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "English",
    commandCategory: "translator",
    usages: "[Text]",
    cooldowns: 5,
    dependencies: {
        "request": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    }

    let content = args.join(" ");
    if (content.length === 0 && event.type !== "message_reply") {
        return global.utils.throwError(this.config.name, event.threadID, event.messageID);
    }

    let translateThis = content.slice(0, content.indexOf(" ->"));
    let lang = content.substring(content.indexOf(" -> ") + 4);

    if (event.type === "message_reply") {
        translateThis = event.messageReply.body;
        lang = content.indexOf("-> ") !== -1 ? content.substring(content.indexOf("-> ") + 3) : 'en';
    } else if (content.indexOf(" -> ") === -1) {
        translateThis = content.slice(0, content.length);
        lang = 'fil';
    }

    const encodedText = encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`);
    return request(encodedText, (err, response, body) => {
        if (err) return api.sendMessage("Error occurred while translating.", event.threadID, event.messageID);

        const retrieve = JSON.parse(body);
        let text = '';
        retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
        const fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];

        api.sendMessage(`English: ${text}\n - Translated ${fromLang} to ${lang}`, event.threadID, event.messageID);
    });
};
