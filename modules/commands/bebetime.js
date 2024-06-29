const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "bebetime",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "bebetime AI modified by ☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    commandCategory: "Single (Lonely)",
    usages: "[question] or [on,off]",
    cooldowns: 5
};

module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const log = require(process.cwd() + '/utils/log');
    const path = resolve(__dirname, 'cache', 'bebetime.json');
    if (!existsSync(path)) {
        const obj = {
            bebetime: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('bebetime')) data.bebetime = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
};

module.exports.handleEvent = async ({ api, event, args, Threads }) => {
    const { threadID, messageID } = event;
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, '../commands', 'cache', 'bebetime.json');
    const { bebetime } = require(path);
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    // Command logic goes here
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const path = resolve(__dirname, 'cache', 'bebetime.json');
        const database = require(path);
        const { bebetime } = database;

        if (bebetime.hasOwnProperty(threadID) && bebetime[threadID] == true) {
            if (event.senderID !== api.getCurrentUserID()) {
                axios.get(encodeURI(`https://umaru-api-33012509.umaru33012509.repl.co/bebetime/get/${event.body}`)).then(res => {
                    if (res.data.reply == "null" || res.data.reply == "I can't do that") {
                        api.sendMessage("I can't do that", threadID, messageID)
                    } else {
                        return api.sendMessage(res.data.reply, threadID, messageID);
                    }
                });
            }
        } else {
            if (!args[0]) {
                api.sendMessage("I love you mwah mwuah", threadID, messageID)
            } else {
                switch (args[0]) {
                    case "on": {
                        bebetime[threadID] = true;
                        api.sendMessage("bebetime AI chat successfully on", threadID);
                        break;
                    }
                    case "off": {
                        bebetime[threadID] = false;
                        api.sendMessage("bebetime AI chat successfully off", threadID);
                        break;
                    }
                    default:
                        axios.get(encodeURI(`https://umaru-api-33012509.umaru33012509.repl.co/bebetime/get/${args.join(" ")}`)).then(res => {
                            if (res.data.reply == "null" || res.data.reply == "I can't do that") {
                                api.sendMessage("I can't do that", threadID, messageID)
                            } else {
                                return api.sendMessage(res.data.reply, threadID, messageID);
                            }
                        });
                        break;
                }
                writeFileSync(path, JSON.stringify(database, null, 4));
            }
        }
    }
};
