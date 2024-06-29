const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "delete",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "discord delete image",
    commandCategory: "edit-img",
    usages: "delete or delete [@mention]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "discord.js": "",
        "discord-image-generation": "",
        "node-superfetch": ""
    }
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
        if (module.exports.config.credits !== '☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆') {
            console.log('\x1b[33m[ WARN ]\x1b[37m » Change credits to your mothers dick, bitch:))' + global.config.BOTNAME + ' đổi credits modules "' + module.exports.config.name + '"');
            return api.sendMessage('[ WARN ] Detect bot operator ', event.threadID, event.messageID);
        }

        var id = Object.keys(event.mentions)[0] || event.senderID;
        var currency = args.toString().replace(/,/g, '  ')
        var avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        let img = await new DIG.Delete().getImage(avatar)
        let attach = new Discord.MessageAttachment(img);
        var path_wanted = __dirname + "/cache/wetd.png";
        fs.writeFileSync(path_wanted, attach.attachment);
        api.sendMessage({ attachment: fs.createReadStream(path_wanted) }, event.threadID, () => fs.unlinkSync(path_wanted), event.messageID);
    }
    //other command logic goes here
};
