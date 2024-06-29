const fs = require('fs');
const path = require('path');

// Module export goes here
module.exports.config = {
    name: "rule",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Customize the rules for each group",
    commandCategory: "Box Chat",
    usages: "[add/remove/all] [content/ID]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const pathData = join(__dirname, "cache", "rules.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const pathData = path.join(__dirname, "cache", "rules.json");
        const content = args.slice(1).join(" ");
        var dataJson = JSON.parse(fs.readFileSync(pathData, "utf-8"));
        var thisThread = dataJson.find(item => item.threadID === threadID) || { threadID, listRule: [] };

        switch (args[0]) {
            case "add": {
                // Logic for adding rules
                break;
            }
            case "list":
            case "all": {
                // Logic for listing rules
                break;
            }
            case "rm":
            case "remove":
            case "delete": {
                // Logic for removing rules
                break;
            }
            default: {
                // Logic for default case
                break;
            }
        }

        if (!dataJson.some(item => item.threadID === threadID)) dataJson.push(thisThread);
        fs.writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
    }
    // Other command logic goes here
};
