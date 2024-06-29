const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "chords",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "search chords (English song only.)",
    usages: "[Title]",
    commandCategory: "...",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let title = args.join(" ");
        const res = await axios.get(`https://st4rz.herokuapp.com/api/chord?q=${title}`);
        const plaintext = res.data.result;
        return api.sendMessage(`${plaintext}`, threadID, messageID);
    }
};
