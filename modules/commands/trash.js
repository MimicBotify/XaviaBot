const fs = require('fs');
const axios = require('axios');
const DIG = global.nodemodule["discord-image-generation"];
const Discord = global.nodemodule['discord.js'];
const request = global.nodemodule["node-superfetch"];

module.exports.config = {
    name: "trash",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "trash",
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

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const id = Object.keys(event.mentions)[0] || event.senderID;
        const avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        const img = await new DIG.Trash().getImage(avatar);
        const attach = new Discord.MessageAttachment(img);
        const path_trash = __dirname + "/cache/trash.png";

        fs.writeFileSync(path_trash, attach.attachment);
        api.sendMessage({ attachment: fs.createReadStream(path_trash) }, event.threadID, () => fs.unlinkSync(path_trash), event.messageID);
    }
};
