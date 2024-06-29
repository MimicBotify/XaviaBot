const fs = require('fs');
const axios = require('axios');
const { loadImage, createCanvas } = require('canvas');

module.exports.config = {
    name: "obama",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Obama Tweet post",
    commandCategory: "edit-img",
    usages: "[text]",
    cooldowns: 10,
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
    // ... (your wrapText function remains the same)
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const pathImg = __dirname + '/cache/trump.png';
        const text = args.join(" ");
        if (!text) return api.sendMessage("Enter the content of the comment on the board", threadID, messageID);

        try {
            const getPorn = (await axios.get(`https://i.imgur.com/6fOxdex.png`, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));

            const baseImage = await loadImage(pathImg);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");

            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.font = "400 45px Arial";
            ctx.fillStyle = "#000000";
            ctx.textAlign = "start";

            let fontSize = 250;
            while (ctx.measureText(text).width > 2600) {
                fontSize--;
                ctx.font = `400 ${fontSize}px Arial, sans-serif`;
            }

            const lines = await this.wrapText(ctx, text, 1160);
            ctx.fillText(lines.join('\n'), 60, 165); // Adjust position for comment

            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, imageBuffer);

            return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while processing the command.", threadID, messageID);
        }
    }
    // other command logic goes here
}
