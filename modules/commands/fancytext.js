const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "fancytext",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    usages: "[text]",
    description: "fancy text font",
    commandCategory: "Other",
    cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            let juswa = args.join(" ");
            const res = await axios.get(`https://api-toxic-devil.herokuapp.com/api/fancy-text?text=${juswa}`);
            var re = res.data.result;
            return api.sendMessage(`${re}`, threadID, messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while processing your request.", threadID, messageID);
        }
    }
};
