const fs = require('fs');
const axios = require('axios');
const request = global.nodemodule["request"];

module.exports.config = {
    name: "japanese",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "nihonggo",
    commandCategory: "translator",
    usages: `\nTranslator cannot be left blank\n\nHow to use?\n${global.config.PREFIX}japanese <text>\nelse\n${global.config.PREFIX}japanese <msg reply>\n\nExample:\n${global.config.PREFIX}japanese love you\nelse\n${global.config.PREFIX}japanese <swipe reply>\n`,
    cooldowns: 5,
    dependencies: {
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const content = args.join(" ");

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    }

    let translateThis = '';
    let lang = 'ja';

    if (content.length === 0 && event.type !== "message_reply") {
        return global.utils.throwError(this.config.name, event.threadID, event.messageID);
    }

    if (event.type === "message_reply") {
        translateThis = event.messageReply.body;
        lang = content.includes("-> ") ? content.substring(content.indexOf("-> ") + 3) : 'ja';
    } else if (!content.includes(" -> ")) {
        translateThis = content;
    } else {
        translateThis = content.slice(0, content.indexOf(" ->"));
        lang = content.substring(content.indexOf(" -> ") + 4);
    }

    const encodedTranslateThis = encodeURIComponent(translateThis);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodedTranslateThis}`;

    try {
        const response = await axios.get(url);
        const retrieve = response.data;
        let text = '';
        retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
        const fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
        api.sendMessage(text, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while translating.", event.threadID, event.messageID);
    }
    // other command logic goes here
};
