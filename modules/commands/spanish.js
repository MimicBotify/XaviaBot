const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "spanish",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Translate to Spanish",
    commandCategory: "translator",
    usages: "[Text]",
    cooldowns: 5,
    dependencies: {
        "request": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        let content = args.join(" ");
        if (content.length === 0 && event.type !== "message_reply") {
            return global.utils.throwError(this.config.name, event.threadID, event.messageID);
        }
        
        let translateThis = content.slice(0, content.indexOf("->"));
        let lang = content.substring(content.indexOf("->") + 3);
        
        if (event.type === "message_reply") {
            translateThis = event.messageReply.body;
            if (content.indexOf("->") !== -1) {
                lang = content.substring(content.indexOf("->") + 3);
            } else {
                lang = 'es';
            }
        } else if (content.indexOf("->") === -1) {
            translateThis = content;
            lang = 'es';
        }
        
        return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
            if (err) {
                return api.sendMessage("There was an error during translation.", event.threadID, event.messageID);
            }
            
            const retrieve = JSON.parse(body);
            let text = '';
            retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
            const fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
            
            api.sendMessage(`${text}`, event.threadID, event.messageID);
        });
    }
};
