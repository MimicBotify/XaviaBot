const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "snauzk",
    version: "1.0.0",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Random video tiktok channel snauzk",
    commandCategory: "media",
    cooldowns: 3
};

module.exports.run = async function({ api, event }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        axios.get('https://apivideo.nebin.repl.co/snauzk/?apikey=binee1805').then(res => {
            const ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
            const callback = function () {
                api.sendMessage({
                    body: `Quality ♥`,
                    attachment: fs.createReadStream(__dirname + `/cache/snauzk.${ext}`)
                }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/snauzk.${ext}`), event.messageID);
            };
            request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/snauzk.${ext}`)).on("close", callback);
        });
    }
    // Other command logic goes here if needed
};
