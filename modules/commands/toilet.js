const fs = require('fs');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const jimp = require('jimp');

module.exports.config = {
    name: "toilet",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Toilet 🚽",
    commandCategory: "hình ảnh",
    usages: "rank",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "canvas": "",
        "jimp": "",
        "node-superfetch": ""
    }
};

module.exports.circle = async (image) => {
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync(jimp.MIME_PNG);
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            const canvas = createCanvas(500, 670);
            const ctx = canvas.getContext('2d');
            const background = await loadImage('https://cdn.discordapp.com/attachments/779441456464003122/812706484240121876/unknown.png');

            const id = Object.keys(event.mentions)[0] || event.senderID;
            const avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);

            const avatarBuffer = await this.circle(avatar.body);
            const avatarImage = await loadImage(avatarBuffer);

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(avatarImage, 135, 350, 205, 205);

            const path_toilet = __dirname + '/cache/toilet.png';
            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(path_toilet, imageBuffer);

            api.sendMessage({ attachment: fs.createReadStream(path_toilet), body: "Toilet image" }, threadID, () => fs.unlinkSync(path_toilet), messageID);
        } catch (e) {
            api.sendMessage(e.stack, threadID);
        }
    }
};
