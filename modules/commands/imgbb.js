const fs = require('fs');
const axios = require('axios');

// module export goes here
module.exports.config = {
    name: "imgbb",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "imgbb uploader(limited)",
    commandCategory: "tools",
    usages: "[reply to image]",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, messageReply } = event;
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            let linkanh = (messageReply && messageReply.attachments[0].url) || args[0];
            if (!linkanh) return api.sendMessage('Please reply to an image or provide an image link.', threadID, messageID);

            const res = await axios.get(`http://zekais-api.herokuapp.com/imgbb?url=${encodeURIComponent(linkanh)}&apikey=N3MqSq2j`);
            const juswa = res.data.uploaded.image;

            return api.sendMessage(`Here is your imgur link:\n\n${juswa}`, threadID, messageID);
        } catch (error) {
            console.log(error);
            return api.sendMessage("An error occurred while processing the image.", threadID, messageID);
        }
    }
};
