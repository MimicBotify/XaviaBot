const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "imganime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Random ảnh anime",
    commandCategory: "Random-IMG",
    usages: "imganime",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        axios.get('https://anime.ocvat2810.repl.co/')
            .then(res => {
                const ext = res.data.data.substring(res.data.data.lastIndexOf(".") + 1);
                const callback = function () {
                    api.sendMessage({
                        attachment: fs.createReadStream(__dirname + `/cache/shiba.${ext}`)
                    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/shiba.${ext}`), event.messageID);
                };
                request(res.data.data).pipe(fs.createWriteStream(__dirname + `/cache/shiba.${ext}`)).on("close", callback);
            })
            .catch(err => {
                console.error(err);
                api.sendMessage("There was an issue while processing your request.", event.threadID, event.messageID);
            });
    }
    // Other command logic goes here
};
