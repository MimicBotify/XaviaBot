const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "imgur",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "imgur upload",
    commandCategory: "link",
    usages: `Please reply to image\n\nHow to use?\n${global.config.PREFIX}imgur [reply] <img>\n\nExample:\n${global.config.PRFIX}imgur <img reply>\n`,
    cooldowns: 1,
    dependencies: {
        "axios": "",
    }
};

module.exports.run = async function({ api, event, args }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    }

    const imgLink = event.messageReply.attachments[0].url || args.join(" ");
    if (!imgLink) {
        return api.sendMessage(`Please reply to image\n\nHow to use?\n${global.config.PREFIX}imgur [reply] <img>\n\nExample:\n${global.config.PRFIX}imgur <img reply>\n\nCreated by: ZiaRein`, event.threadID, event.messageID);
    }

    try {
        const res = await axios.get(`https://api.phamvandien.xyz/imgur?link=${encodeURIComponent(imgLink)}`);
        const uploadedImgurLink = res.data.uploaded.image;
        return api.sendMessage(uploadedImgurLink, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage("An error occurred while uploading the image to imgur.", event.threadID, event.messageID);
    }
};
