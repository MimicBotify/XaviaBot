const fs = require('fs');
const axios = require('axios');
const DIG = global.nodemodule["discord-image-generation"];
const Discord = global.nodemodule['discord.js'];
const request = global.nodemodule["node-superfetch"];
const fsExtra = global.nodemodule["fs-extra"];

module.exports.config = {
    name: "kissv2",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "kiss",
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

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fsExtra.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const id = Object.keys(event.mentions)[0] || event.senderID;
        const ids = Object.keys(event.mentions)[1] || event.senderID;

        const avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
        const avatars = (await request.get(`https://graph.facebook.com/${ids}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        const img = await new DIG.Kiss().getImage(avatar, avatars);
        const attach = new Discord.MessageAttachment(img);
        const pathTrash = __dirname + "/cache/kissv2.png";
        fs.writeFileSync(pathTrash, attach.attachment);

        api.sendMessage({ attachment: fs.createReadStream(pathTrash) }, threadID, () => fs.unlinkSync(pathTrash), messageID);
    }
    // Other command logic goes here
};
