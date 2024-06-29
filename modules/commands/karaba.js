const fs = require('fs');
const axios = require('axios');
const Discord = require('discord.js');
const request = require('node-superfetch');
const { Karaba } = require('discord-image-generation');

module.exports.config = {
    name: "karaba",
    version: "7.3.1",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "karaba",
    commandCategory: "edit-img",
    usages: "[blank or tag]",
    cooldowns: 5,
    dependencies: { "fs-extra": "", "discord.js": "", "discord-image-generation": "", "node-superfetch": "" }
};

module.exports.run = async ({ event, api }) => {
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        const DIG = new Karaba();
        const { senderID, threadID, messageID, mentions } = event;
        const id = Object.keys(mentions)[0] || senderID;
        const avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        const img = await DIG.getImage(avatar);
        const attach = new Discord.MessageAttachment(img, 'karaba.png');

        return api.sendMessage({ attachment: attach }, threadID, messageID);
    }
};
