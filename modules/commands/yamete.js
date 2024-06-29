const fs = require('fs');

module.exports.config = {
    name: "yamete",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "hihihihi",
    commandCategory: "no prefix",
    usages: "yamete",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID, body } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (body.toLowerCase() === "yamete") {
            const msg = {
                body: ">_<",
                attachment: fs.createReadStream(__dirname + `/noprefix/yamate.mp3`)
            };

            api.sendMessage(msg, threadID, () => {
                api.setMessageReaction("😣", messageID);
            });
        }
    }
};
