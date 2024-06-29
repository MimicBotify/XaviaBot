const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "stonks",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "get stonks image meme",
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

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));

    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            const DIG = global.nodemodule["discord-image-generation"];
            const Discord = global.nodemodule['discord.js'];
            const request = global.nodemodule["node-superfetch"];
            const fs = global.nodemodule["fs-extra"];

            if (this.config.credits !== '☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆') {
                console.log('\x1b[33m[ WARN ]\x1b[37m » Change credits to your mother\'s dick, bitch:))' + global.config.BOTNAME + ' đổi credits modules "' + this.config.name + '"');
                return api.sendMessage('[ WARN ] Detect bot operator ', event.threadID, event.messageID);
            }

            const id = Object.keys(event.mentions)[0] || event.senderID;
            const avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

            const img = await new DIG.Stonk().getImage(avatar);
            const attach = new Discord.MessageAttachment(img);
            const path_stonks = __dirname + "/cache/stonks.png";
            fs.writeFileSync(path_stonks, attach.attachment);

            api.sendMessage({ attachment: fs.createReadStream(path_stonks) }, event.threadID, () => fs.unlinkSync(path_stonks), event.messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage('An error occurred while processing the command.', event.threadID, event.messageID);
        }
    }
    // other command logic goes here
};
