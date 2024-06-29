const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "egg",
    version: "7.3.1",
    hasPermssion: 0,
    credits: " ☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "egg",
    commandCategory: "edit-img",
    usages: "[blank or tag]",
    cooldowns: 5,
    dependencies: {"fs-extra": "","discord.js": "","discord-image-generation" :"","node-superfetch": ""}
};

module.exports.run = async function ({ event, api, args, Users }) {
    const DIG = global.nodemodule["discord-image-generation"];
    const Discord = global.nodemodule['discord.js'];
    const request = global.nodemodule["node-superfetch"];
    const fs = global.nodemodule["fs-extra"];

    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        var id = Object.keys(event.mentions)[0] || event.senderID;
        var avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
        
        let img = await new DIG.Mms().getImage(avatar);
        let attach = new Discord.MessageAttachment(img);
        var path_trash = __dirname + "/cache/egg.png";
        fs.writeFileSync(path_trash, attach.attachment);
        api.sendMessage({attachment: fs.createReadStream(path_trash)}, event.threadID, () => fs.unlinkSync(path_trash), event.messageID);
    }
    // Other command logic goes here
};
