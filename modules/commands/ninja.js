const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "ninja",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Change your nickname to your ninja name",
    usages: "[Name]",
    commandCategory: "...",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const juswa = args.join(" ");
        try {
            const res = await axios.get(`https://docs-jojo.herokuapp.com/api/ninja_name?name=${juswa}`);
            const ninjaName = res.data.result;
            await api.changeNickname(ninjaName, threadID, senderID);
            return api.sendMessage(`Successfully changed nickname to ${ninjaName}`, threadID, messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while changing the nickname.", threadID, messageID);
        }
    }
    //other command logic goes here
};
