const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "dog",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Xem Boss",
    commandCategory: "Picture",
    usages: "dog [Text]",
    cooldowns: 1,
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        axios.get('https://nekos.life/api/v2/img/woof')
            .then(res => {
                let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);

                const callback = () => {
                    api.sendMessage({
                        attachment: fs.createReadStream(__dirname + `/cache/dog.${ext}`)
                    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/dog.${ext}`), event.messageID);
                };

                request(res.data.url)
                    .pipe(fs.createWriteStream(__dirname + `/cache/dog.${ext}`))
                    .on("close", callback);
            })
            .catch(err => {
                console.error(err);
            });
    }
    //other command logic goes here
};
