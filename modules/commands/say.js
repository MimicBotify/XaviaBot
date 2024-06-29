const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "say",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "text to voice",
    commandCategory: "media",
    usages: `please add a language or leave it blank\n\nHow to use?\n${global.config.PREFIX}say <lang> text\n\nExample:\n${global.config.PREFIX}say fil im pretty\n\nNote: please use a shortcut lang <ru, en, ko, ja, fil>\n\nlang's available:\n\nfil = filipino\nja = japan\nru = russia\nko = korea\n`,
    cooldowns: 5,
    dependencies: {
        "path": "",
        "fs-extra": ""
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
            const { createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
            const { resolve } = global.nodemodule["path"];
            var content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
            var languageToSay = (["ru","en","ko","ja","fil"].some(item => content.indexOf(item) == 0)) ? content.slice(0, content.indexOf(" ")) : global.config.language;
            var msg = (languageToSay != global.config.language) ? content.slice(3, content.length) : content;
            const path = resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);
            await global.utils.downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`, path);
            return api.sendMessage({ attachment: createReadStream(path)}, event.threadID, () => unlinkSync(path), event.messageID);
        } catch (e) {
            console.log(e);
            return api.sendMessage("An error occurred while processing the command.", threadID, messageID);
        }
    }
    //other command logic goes here
}
