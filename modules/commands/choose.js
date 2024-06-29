const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "choose",
    version: "1.0.1",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Thanks to the bot cho cho helped one of the things you need to do below",
    commandCategory: "Utilities",
    usages: "[Option 1] | [Option 2]",
    cooldowns: 5
};

module.exports.languages = {
    "vi": {
        "return": "%1 𝐩𝐡𝐮̀ 𝐡𝐨̛̣𝐩 𝐯𝐨̛́𝐢 𝐛𝐚̣𝐧 𝐡𝐨̛𝐧, 𝐭𝐡𝐞𝐨 𝐛𝐨𝐭 𝐜𝐮𝐭𝐞 𝐧𝐠𝐡𝐢̃ 𝐥𝐚̀ 𝐯𝐚̣̂𝐲 𝐚́"
    },
    "en": {
        "return": "%1 is more suitable with you, I think so :thinking:"
    }
};

module.exports.run = async ({ api, event, args, getText }) => {
    const { threadID, messageID } = event;

    if (!args[0]) return global.utils.throwError(module.exports.config.name, threadID, messageID);

    const input = args.join(" ").trim();
    const array = input.split(" | ");
    return api.sendMessage(getText("return", array[Math.floor(Math.random() * array.length)]), threadID, messageID);
};
