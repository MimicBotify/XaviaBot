const fs = require('fs');
const axios = require('axios');
const { loadImage, createCanvas } = require('canvas');

module.exports.config = {
    name: "bang",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Comment on a board",
    commandCategory: "Edit-IMG",
    usages: "bang [text]",
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
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const pathImg = __dirname + '/cache/bang.png'; // Modify the file name as needed
        const text = args.join(" ");

        if (!text) return api.sendMessage("Please provide text to put on the board.", threadID, messageID);

        try {
            const getPorn = (await axios.get(`https://i.imgur.com/Jl7sYMm.jpeg`, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));

            const baseImage = await loadImage(pathImg);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");

            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.font = "bold 20px Valera";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "start";

            let fontSize = 20;
            while (ctx.measureText(text).width > 2250) {
                fontSize--;
                ctx.font = `bold ${fontSize}px Valera, sans-serif`;
            }

            const lines = await this.wrapText(ctx, text, 440);
            ctx.fillText(lines.join('\n'), 85, 100); // Adjust comment position

            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, imageBuffer);

            return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while processing the command.", threadID, messageID);
        }
    }
};