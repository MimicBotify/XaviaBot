const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "mlstalk",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "morse code to text",
    usages: "[id | server]",
    commandCategory: "...",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        try {
            const text = args.join(" ");
            const [text1, text2] = text.split(" | ");

            if (!text1 || !text2) {
                return api.sendMessage("Please provide both ID and server.", event.threadID, event.messageID);
            }

            const res = await axios.get(`https://betabotz-api.herokuapp.com/api/stalk/ml?id=${text1}&server=${text2}&apikey=BetaBotz`);
            const plaintext = res.data.result.userName;
            return api.sendMessage(`${plaintext}`, event.threadID, event.messageID);
        } catch (error) {
            console.error("Error:", error);
            return api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
        }
    }
};
