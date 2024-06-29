const fs = require('fs');
const axios = require('axios');
const FastSpeedtest = require('fast-speedtest-api');

module.exports.config = {
    name: "speedtest",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Test server speed",
    commandCategory: "system",
    cooldowns: 3000,
    dependencies: {
        "fast-speedtest-api": ""
    }
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            const speedTest = new FastSpeedtest({
                token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
                verbose: false,
                timeout: 10000,
                https: true,
                urlCount: 5,
                bufferSize: 8,
                unit: FastSpeedtest.UNITS.Mbps
            });
            const result = await speedTest.getSpeed();
            return api.sendMessage(
                "Result speed test:\n- Speed: " + result + " Mbps",
                threadID, messageID
            );
        } catch {
            return api.sendMessage("Can't perform the speed test right now. Please try again later!", threadID, messageID);
        }
    }
    // Other command logic goes here
};
