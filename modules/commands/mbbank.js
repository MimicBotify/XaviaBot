const fs = require('fs');
const axios = require('axios');
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
    name: "mbbank",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Comment on the board ( ͡° ͜ʖ ͡°)",
    commandCategory: "Edit-IMG",
    usages: "[text]",
    cooldowns: 1,
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let pathImg = __dirname + '/cache/google.png';
        var text = args.join(" ");
        if (!text) return api.sendMessage("Enter the comment content on the table", threadID, messageID);

        try {
            let getPorn = (await axios.get(`https://i.imgur.com/VhBb8SR.png`, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
            let baseImage = await loadImage(pathImg);
            let canvas = createCanvas(baseImage.width, baseImage.height);
            let ctx = canvas.getContext("2d");
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.font = "400 100px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "start";
            let fontSize = 100;

            while (ctx.measureText(text).width > 1200) {
                fontSize--;
                ctx.font = `400 ${fontSize}px Arial`;
            }

            const lines = await this.wrapText(ctx, text, 470);
            ctx.fillText(lines.join('\n'), 840, 540); // Adjust position as needed
            ctx.beginPath();
            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, imageBuffer);

            return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while processing the command.", threadID, messageID);
        }
    }
    // Other command logic goes here
};
