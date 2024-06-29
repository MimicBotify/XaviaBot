const fs = require('fs');
const axios = require('axios');
const Discord = require('discord.js');
const DIG = require('discord-image-generation');
const request = require('node-superfetch');

// Module export goes here
module.exports.config = {
    name: "rip",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Create a RIP meme image",
    commandCategory: "edit-img",
    usages: "rip",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "discord.js": "",
        "discord-image-generation": "",
        "node-superfetch": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (this.config.credits !== '☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆') {
            console.log('\x1b[33m[ WARN ]\x1b[37m » Change credits to your own, ' + global.config.BOTNAME + ' change the credits for the module "' + this.config.name + '"');
            return api.sendMessage('[ WARN ] Detected operator change', event.threadID, event.messageID);
        }
        const id = Object.keys(event.mentions)[0] || event.senderID;
        const currency = args.toString().replace(/,/g, ' ');
        const avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        const img = await new DIG.Rip().getImage(avatar);
        const attach = new Discord.MessageAttachment(img);
        const path_wanted = __dirname + "/cache/wetd.png";
        fs.writeFileSync(path_wanted, attach.attachment);
        api.sendMessage({ attachment: fs.createReadStream(path_wanted) }, event.threadID, () => fs.unlinkSync(path_wanted), event.messageID);
    }
    // Other command logic goes here
};
