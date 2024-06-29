const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "searchv2",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Tìm kiếm kết quả trên Google",
    commandCategory: "info",
    usages: "search [Text]",
    cooldowns: 5,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let textNeedSearch = "";
        const regex = /(https?:\/\/.*?\.(?:png|jpe?g|gif)(?:\?(?:[\w_-]+=[\w_-]+)(?:&[\w_-]+=[\w_-]+)*)?(.*))($)/;
        (event.type == "message_reply") ? textNeedSearch = event.messageReply.attachments[0].url : textNeedSearch = args.join(" ");
        const searchURL = (regex.test(textNeedSearch)) ?
            `https://www.google.com/searchbyimage?&image_url=${textNeedSearch}` :
            `https://www.google.com.vn/search?q=${encodeURIComponent(textNeedSearch)}`;

        api.sendMessage(searchURL, threadID, messageID);
        // Other command logic goes here
    }
};
