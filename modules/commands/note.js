const fs = require('fs');
const { join } = global.nodemodule["path"];
const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];

module.exports.config = {
    name: "note",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Customize notes for each group",
    commandCategory: "Box chat",
    usages: "[add/remove/all] [note]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
}

module.exports.onLoad = () => {
    const pathData = join(__dirname, "cache", "notes.json");
    if (!fs.existsSync(pathData)) writeFileSync(pathData, "[]", "utf-8");
}

module.exports.run = async function({ api, event, args, permission }) {
    const { threadID, messageID } = event;
    const pathData = join(__dirname, "cache", "notes.json");
    const content = args.slice(1).join(" ");
    const dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    let thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };

    switch (args[0]) {
        case "add": {
            if (permission == 0) return api.sendMessage("[Note] You do not have enough power to use this command. Only administrators can use it!", threadID, messageID);
            if (!content) return api.sendMessage("[Note] Please provide a note to add.", threadID, messageID);
            if (content.includes("\n")) {
                const contentSplit = content.split("\n");
                thisThread.listRule.push(...contentSplit);
            } else {
                thisThread.listRule.push(content);
            }
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            return api.sendMessage("[Note] Successfully added new notes to the group!", threadID, messageID);
        }
        case "list":
        case "all": {
            if (!thisThread.listRule.length) return api.sendMessage("[Note] This group does not have any notes to display!", threadID, messageID);
            const msg = thisThread.listRule.map((item, index) => `${index + 1}/ ${item}`).join("\n");
            return api.sendMessage(`Notes for this group:\n\n${msg}`, threadID, messageID);
        }
        case "remove":
        case "delete": {
            if (!content) return api.sendMessage("[Note] Please specify the index or 'all' to remove notes.", threadID, messageID);
            if (permission == 0) return api.sendMessage("[Note] You do not have enough power to use this command. Only administrators can use it!", threadID, messageID);
            
            if (content === "all") {
                thisThread.listRule = [];
                writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
                return api.sendMessage("[Note] Successfully deleted all notes for this group!", threadID, messageID);
            }
            
            const index = parseInt(content);
            if (isNaN(index) || index < 1 || index > thisThread.listRule.length) {
                return api.sendMessage("[Note] Invalid index provided. Please provide a valid index to delete a note.", threadID, messageID);
            }

            thisThread.listRule.splice(index - 1, 1);
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            return api.sendMessage(`[Note] Successfully deleted note at index ${index}.`, threadID, messageID);
        }
        default: {
            if (thisThread.listRule.length) {
                const msg = thisThread.listRule.map((item, index) => `${index + 1}/ ${item}`).join("\n");
                return api.sendMessage(`Notes for this group:\n\n${msg}`, threadID, messageID);
            } else {
                return api.sendMessage("[Note] This group does not have any notes to display!", threadID, messageID);
            }
        }
    }
}
