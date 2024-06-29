const fs = require('fs');
const axios = require('axios');
const Discord = require('discord.js');
const DIG = require('discord-image-generation');
const request = require('node-superfetch');

module.exports.config = {
    name: "hitler",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "most dangerous meme",
    commandCategory: "edit-img",
    usages: "[blank or tag]",
    cooldowns: 5,
    dependencies: { "fs-extra": "", "discord.js": "", "discord-image-generation": "", "node-superfetch": "" }
};

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (this.config.credits !== '☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆') {
            console.log('\x1b[33m[ WARN ]\x1b[37m » Change credits to your mother\'s information.' + global.config.BOTNAME + ' changed the credits in the module "' + this.config.name + '"');
            return api.sendMessage('[ WARN ] Detect bot operator.', event.threadID, event.messageID);
        }
        
        let { senderID, threadID, messageID } = event;
        var id = Object.keys(event.mentions)[0] || event.senderID;
        var avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
        let img = await new DIG.Hitler().getImage(avatar);
        let attach = new Discord.MessageAttachment(img);
        var path_hitler = __dirname + "/cache/hitler.png";
        fs.writeFileSync(path_hitler, attach.attachment);
        api.sendMessage({ attachment: fs.createReadStream(path_hitler) }, event.threadID, () => fs.unlinkSync(path_hitler), event.messageID);
    }
}
