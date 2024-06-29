const fs = require('fs');
const axios = require('axios');
const DIG = global.nodemodule["discord-image-generation"];
const Discord = global.nodemodule['discord.js'];
const request = global.nodemodule["node-superfetch"];

module.exports.config = {
    name: "wanted",
    version: "1.0.0",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Use money units like $, €",
    commandCategory: "edit-img",
    usages: "wanted",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "discord.js": "",
        "discord-image-generation": "",
        "node-superfetch": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID, mentions, senderID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (module.exports.config.credits !== '☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆') {
            console.log('\x1b[33m[ WARN ]\x1b[37m » Change credits to your preferred value: ' + module.exports.config.name);
            return api.sendMessage('[ WARN ] Detected bot operator', event.threadID, event.messageID);
        }

        const id = Object.keys(event.mentions)[0] || event.senderID;
        const currency = args.join(' ');
        const avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        const img = await new DIG.Wanted().getImage(avatar, currency);
        const attach = new Discord.MessageAttachment(img);
        const path_wanted = __dirname + "/cache/wanted.png";

        fs.writeFileSync(path_wanted, attach.attachment);
        api.sendMessage({ attachment: fs.createReadStream(path_wanted) }, event.threadID, () => fs.unlinkSync(path_wanted), event.messageID);
    }
    // Other command logic if applicable
};
