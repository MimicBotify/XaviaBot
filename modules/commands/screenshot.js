const fs = require('fs');
const axios = require('axios');
const { existsSync } = global.nodemodule["fs-extra"];
const { resolve } = global.nodemodule["path"];
const url = global.nodemodule["url"];

//module export goes here
module.exports.config = {
    name: "screenshot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Screenshot a website. 18+ website is not allowed",
    commandCategory: "other",
    usages: "[url site]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": "",
        "url": ""
    }
};

module.exports.onLoad = async () => {
    const path = resolve(__dirname, "cache", "pornlist.txt");

    if (!existsSync(path)) {
        await global.utils.downloadFile("https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt", path);
    }
};

module.exports.run = async ({ api, event, args }) => {
    const { readFileSync, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        try {
            if (!global.moduleData.pornList) {
                global.moduleData.pornList = readFileSync(__dirname + "/cache/pornlist.txt", "utf-8")
                    .split('\n')
                    .filter(site => site && !site.startsWith('#'))
                    .map(site => site.replace(/^(0.0.0.0 )/, ''));
            }

            const urlParsed = url.parse(args[0]);

            if (global.moduleData.pornList.some(pornURL => urlParsed.host == pornURL)) {
                return api.sendMessage("The site you entered is not secure!!(NSFW PAGE)", event.threadID, event.messageID);
            }

            const path = __dirname + `/cache/${event.threadID}-${event.senderID}s.png`;
            await global.utils.downloadFile(`https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${args[0]}`, path);
            api.sendMessage({ attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path));
        } catch {
            return api.sendMessage("This url could not be found, or the format is incorrect.", event.threadID, event.messageID);
        }
    }
    //other command logic goes here
};
