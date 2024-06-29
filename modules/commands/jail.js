const fs = require('fs');
const axios = require('axios');
const Discord = require('discord.js');
const DIG = require('discord-image-generation');
const request = require('node-superfetch');

module.exports.config = {
    name: "jail",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "jail",
    commandCategory: "edit-img",
    usages: "[blank or tag]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "discord.js": "",
        "discord-image-generation": "",
        "node-superfetch": ""
    }
};

module.exports.run = async ({ event, api }) => {
    const fs = global.nodemodule["fs-extra"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        const { threadID, messageID } = event;
        const id = Object.keys(event.mentions)[0] || event.senderID;
        const avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        const img = await new DIG.Jail().getImage(avatar);
        const attach = new Discord.MessageAttachment(img);
        const path_trash = __dirname + "/cache/jail.png";
        fs.writeFileSync(path_trash, attach.attachment);

        api.sendMessage({ attachment: fs.createReadStream(path_trash) }, threadID, () => fs.unlinkSync(path_trash), messageID);
    }
    //other command logic goes here
};
