const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "affect",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "meme",
    commandCategory: "edit-img",
    usages: "[blank or tag]",
    cooldowns: 5,
    dependencies: { "fs-extra": "", "discord.js": "", "discord-image-generation": "", "node-superfetch": "" }
};

module.exports.run = async ({ event, api, args, Users }) => {
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
        let id = Object.keys(mentions)[0] || senderID;
        var avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        let img = await new DIG.Affect().getImage(avatar);
        let attach = new Discord.MessageAttachment(img);
        var path_affect = __dirname + "/cache/affect.png";
        fs.writeFileSync(path_affect, attach.attachment);
        api.sendMessage({ attachment: fs.createReadStream(path_affect) }, threadID, () => fs.unlinkSync(path_affect), messageID);
        //other command logic goes here
    }
};
