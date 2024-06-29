const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "bed",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "bed",
    commandCategory: "edit-img",
    usages: "bed",
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
        if (!args[0]) {
            return api.sendMessage("Please Tag Someone!", event.threadID, event.messageID);
        }

        const one = event.senderID;
        const two = Object.keys(event.mentions);

        const avatar = (await request.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
        const avatar2 = (await request.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        const img = await new DIG.Bed().getImage(avatar, avatar2);
        const attach = new Discord.MessageAttachment(img);
        const path_bed = __dirname + "/cache/bed.png";
        fs.writeFileSync(path_bed, attach.attachment);

        api.sendMessage({ attachment: fs.createReadStream(path_bed) }, event.threadID, () => fs.unlinkSync(path_bed), event.messageID);
    }
    //other command logic goes here
};
