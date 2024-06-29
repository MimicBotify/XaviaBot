const fs = require('fs');
const axios = require('axios');
const request = require('request');

// Command configuration
module.exports.config = {
    name: "lucy",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Lucy Fairy Tail",
    commandCategory: "Random-IMG",
    usages: "lucy",
    cooldowns: 5
};

// Command logic
module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        axios.get('https://apilucy.khoahoang3.repl.co').then(res => {
            let ext = res.data.data.substring(res.data.data.lastIndexOf(".") + 1);
            let count = res.data.count;
            let callback = function () {
                api.sendMessage({
                    body: `🌸Lucy here <3\n🌸Number of photos available: ${count} photos`,
                    attachment: fs.createReadStream(__dirname + `/cache/lucy.${ext}`)
                }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/lucy.${ext}`), event.messageID);
            };
            request(res.data.data).pipe(fs.createWriteStream(__dirname + `/cache/lucy.${ext}`)).on("close", callback);
        }).catch(err => {
            console.error(err);
            api.sendMessage("Error fetching Lucy's image. Please try again later.", threadID, messageID);
        });
    }
    // Other command logic goes here if needed
};
