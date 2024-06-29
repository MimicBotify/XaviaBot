const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "gentle",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Gif TR",
    commandCategory: "Random-IMG",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        axios.get('https://apituandz1407.herokuapp.com/api/gai.php').then(res => {
            let ext = res.data.data.substring(res.data.data.lastIndexOf(".") + 1);
            let callback = function () {
                api.sendMessage({
                    body: ``,
                    attachment: fs.createReadStream(__dirname + `/cache/cho.${ext}`)
                }, threadID, () => fs.unlinkSync(__dirname + `/cache/cho.${ext}`), messageID);
            };
            request(res.data.data).pipe(fs.createWriteStream(__dirname + `/cache/cho.${ext}`)).on("close", callback);
        });
    }
    //other command logic goes here
};
