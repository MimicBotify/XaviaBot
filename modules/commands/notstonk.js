const fs = require('fs');
const Discord = require('discord.js');
const request = require('node-superfetch');
const { NotStonk } = require('discord-image-generation');

module.exports.config = {
    name: "not_stonk",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Put in the notstonk meme",
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

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (this.config.credits !== '☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆') {
            console.log('\x1b[33m[ WARN ]\x1b[37m » Change credits to your own. ' + global.config.BOTNAME + ' change credits modules "' + this.config.name + '"');
            return api.sendMessage('[ WARN ] Detect bot operator', threadID, messageID);
        }

        let id = Object.keys(event.mentions)[0] || event.senderID;
        let avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
        let img = await new NotStonk().getImage(avatar);

        let attach = new Discord.MessageAttachment(img);
        let path_notstonk = __dirname + "/cache/notstonk.png";
        fs.writeFileSync(path_notstonk, attach.attachment);

        api.sendMessage({ attachment: fs.createReadStream(path_notstonk) }, threadID, () => fs.unlinkSync(path_notstonk), messageID);
    }
    //other command logic goes here
}
