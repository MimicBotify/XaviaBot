const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "autosetname",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Automatic setname for new members",
    commandCategory: "Box Chat",
    usages: "[add <name> /remove]",
    cooldowns: 5
};

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const pathData = join(__dirname, "cache", "autosetname.json");

    if (!existsSync(pathData)) {
        writeFileSync(pathData, "[]", "utf-8");
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const pathData = join(__dirname, "cache", "autosetname.json");
    const content = args.slice(1).join(" ");
    const dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    const thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    }

    switch (args[0]) {
        case "add": {
            if (!content) {
                return api.sendMessage("The configuration of the new member's name must not be empty!", threadID, messageID);
            }
            if (thisThread.nameUser.length > 0) {
                return api.sendMessage("Please remove the old name configuration before naming a new name!!!", threadID, messageID);
            }
            thisThread.nameUser.push(content);
            const { name } = await api.getUserInfo(event.senderID);
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            return api.sendMessage(`Successfully configured a new member's name\nPreview: ${content} ${name}`, threadID, messageID);
        }
        case "rm":
        case "remove":
        case "delete": {
            if (thisThread.nameUser.length === 0) {
                return api.sendMessage("Your group hasn't configured a new member's name!!", threadID, messageID);
            }
            thisThread.nameUser = [];
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            return api.sendMessage(`Successfully deleted the configuration of a new member's name`, threadID, messageID);
        }
        default: {
            return api.sendMessage(`Usage:\n- autosetname add <name> to configure a nickname for a new member\n- autosetname remove to remove the nickname configuration for the new member`, threadID, messageID);
        }
    }
};
