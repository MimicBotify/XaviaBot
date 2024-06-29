const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "setname",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "set group nickname",
    commandCategory: "Group",
    usages: "[name]",
    cooldowns: 3
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
        const name = args.join(" ");
        const mention = Object.keys(event.mentions)[0];
        
        if (!mention) return api.changeNickname(`${name}`, event.threadID, event.senderID);
        if (mention[0]) return api.changeNickname(`${name.replace(event.mentions[mention], "")}`, event.threadID, mention);
    }
    //other command logic goes here
}
