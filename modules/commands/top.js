const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "top",
    version: "0.0.5",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Top Server!",
    commandCategory: "group",
    usages: "[thread/user/money/level]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args, Currencies, Users }) => {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (!args[0]) return api.sendMessage("You need to specify whether it's 'thread', 'user', 'money', or 'level'.", threadID, messageID);

        switch(args[0]) {
            case "user": {
                let all = await Currencies.getAll(['userID', 'exp']);
                all.sort((a, b) => b.exp - a.exp);
                let msg = {
                    body: 'The 10 People with the Highest Level on the Server!',
                };
                for (let i = 0; i < Math.min(10, all.length); i++) {
                    let level = expToLevel(all[i].exp);
                    let name = (await Users.getData(all[i].userID)).name;
                    msg.body += `\n${i + 1}. ${name} - Level ${level}`;
                }
                return api.sendMessage(msg, threadID, messageID);
            }
            case "thread": {
                let threadList = [];
                let data;
                try {
                    data = await api.getThreadList(20, null, ["INBOX"]);
                } catch (e) {
                    console.log(e);
                }
                for (const thread of data) {
                    if (thread.isGroup === true) threadList.push({ threadName: thread.name, threadID: thread.threadID, messageCount: thread.messageCount });
                }
                threadList.sort((a, b) => b.messageCount - a.messageCount);

                let msg = `Top ${Math.min(threadList.length, 10)} Groups with the Most Messages:\n_____________________________\n`;
                for (let i = 0; i < Math.min(10, threadList.length); i++) {
                    msg += `${i + 1}/ ${(threadList[i].threadName) || "No name"}\nTID: [${threadList[i].threadID}]\nNumber of messages: ${threadList[i].messageCount} message\n\n`;
                }
                msg += "_____________________________";
                return api.sendMessage(msg, threadID, messageID);
            }
            case "money": {
                let all = await Currencies.getAll(['userID', 'money']);
                all.sort((a, b) => b.money - a.money);
                let msg = {
                    body: 'The 10 Richest People on the Server!',
                };
                for (let i = 0; i < Math.min(10, all.length); i++) {
                    let money = all[i].money;
                    let name = (await Users.getData(all[i].userID)).name;
                    msg.body += `\n${i + 1}. ${name}: ${money}💵`;
                }
                return api.sendMessage(msg, threadID, messageID);
            }
            case "level": {
                // Function to convert exp to level
                function expToLevel(point) {
                    if (point < 0) return 0;
                    return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
                }
                let all = await Currencies.getAll(['userID', 'exp']);
                all.sort((a, b) => b.exp - a.exp);
                let msg = {
                    body: 'The 10 People with the Highest Level on the Server!',
                };
                for (let i = 0; i < Math.min(10, all.length); i++) {
                    let level = expToLevel(all[i].exp);
                    let name = (await Users.getData(all[i].userID)).name;
                    msg.body += `\n${i + 1}. ${name} - Level ${level}`;
                }
                return api.sendMessage(msg, threadID, messageID);
            }
            default:
                return api.sendMessage("Invalid argument. Please use 'thread', 'user', 'money', or 'level'.", threadID, messageID);
        }
    }
};
