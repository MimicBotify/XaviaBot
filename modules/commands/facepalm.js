const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "facepalm",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "facepalm",
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

module.exports.run = async function ({ api, event, args, Users }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        var id = Object.keys(event.mentions)[0] || event.senderID;

        var avatar = (await global.nodemodule["node-superfetch"].get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        const DIG = global.nodemodule["discord-image-generation"];
        const Discord = global.nodemodule['discord.js'];

        let img = await new DIG.Facepalm().getImage(avatar);
        let attach = new Discord.MessageAttachment(img);
        var path_facepalm = __dirname + "/cache/facepalm.png";
        fs.writeFileSync(path_facepalm, attach.attachment);
        api.sendMessage({ attachment: fs.createReadStream(path_facepalm) }, event.threadID, () => fs.unlinkSync(path_facepalm), event.messageID);
    }
    // other command logic goes here
}
