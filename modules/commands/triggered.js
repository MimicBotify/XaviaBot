const fs = require('fs');
const axios = require('axios');
const DIG = global.nodemodule["discord-image-generation"];
const Discord = global.nodemodule['discord.js'];
const request = global.nodemodule["node-superfetch"];

module.exports.config = {
    name: "triggered",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "triggered",
    commandCategory: "edit-img",
    usages: "@tag",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "discord.js": "",
        "discord-image-generation": "",
        "node-superfetch": ""
    }
};

module.exports.run = async ({ api, event, args, Users }) => {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        var id = Object.keys(event.mentions)[0] || event.senderID;
        var avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
        let img = await new DIG.Triggered().getImage(avatar);
        let attach = new Discord.MessageAttachment(img);
        var path_trigger = __dirname + "/cache/trigger.gif";
        fs.writeFileSync(path_trigger, attach.attachment);
        api.sendMessage({ attachment: fs.createReadStream(path_trigger) }, event.threadID, () => fs.unlinkSync(path_trigger), event.messageID);
    }
    // other command logic goes here
};
