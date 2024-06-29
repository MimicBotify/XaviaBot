const fs = require('fs');
const axios = require('axios');
const fsExtra = global.nodemodule["fs-extra"];
const Canvas = global.nodemodule["canvas"];

module.exports.config = {
    name: "drake",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "drake",
    commandCategory: "Tiện ích",
    usages: "[text 1] | [text 2]",
    cooldowns: 10
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise((resolve) => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText("W").width > maxWidth) return resolve(null);
    const words = text.split(" ");
    const lines = [];
    let line = "";
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
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
        line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = "";
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};
module.exports.run = async function ({ api, event, args, Users }) {
    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const pathImg = __dirname + `/cache/drake.png`;
        const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");

        // Fetching the image and fonts...

        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        Canvas.registerFont(__dirname + `/cache/SVN-Arial 2.ttf`, {
            family: "SVN-Arial 2"
        });
        ctx.font = "30px SVN-Arial 2";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";

        // Drawing text...

        const line = await this.wrapText(ctx, text[0], 464);
        const lines = await this.wrapText(ctx, text[1], 464);
        ctx.fillText(line.join("\n"), 464, 129);
        ctx.fillText(lines.join("\n"), 464, 339);
        ctx.beginPath();

        // Sending the modified image...

        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        return api.sendMessage(
            { attachment: fs.createReadStream(pathImg) },
            threadID,
            () => fs.unlinkSync(pathImg),
            messageID
        );
    }
    // Other command logic goes here
};
