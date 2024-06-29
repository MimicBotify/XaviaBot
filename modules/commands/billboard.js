const fs = require('fs');
const axios = require('axios');
const { loadImage, createCanvas } = require("canvas");

//module export goes here
module.exports.config = {
    name: "billboard",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Comment trên pỏnhub ( ͡° ͜ʖ ͡°)",
    commandCategory: "edit-img",
    usages: "billoard [text]",
    cooldowns: 5,
    dependencies: {"canvas": "", "axios": ""}
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
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        var text = args.join(" ");
        if (!text) return api.sendMessage("Please put a message", threadID, messageID);

        // Rest of your command logic here

        let getAvatar = (await axios.get(linkAvatar, { responseType: 'arraybuffer' })).data;
        let getPorn = (await axios.get(`https://imgur.com/uN7Sllp.png`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(avatar, Buffer.from(getAvatar, 'utf-8'));
        fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
        let image = await loadImage(avatar);
        let baseImage = await loadImage(pathImg);
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 10, 10, canvas.width, canvas.height);
	ctx.drawImage(image, 148, 75, 110, 110);
	ctx.font = "800 23px Arial";
	ctx.fillStyle = "#fffff";
	ctx.textAlign = "start";
	ctx.fillText(name, 280, 110);
	ctx.font = "400 23px Arial";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "start";
	let fontSize = 55;
	while (ctx.measureText(text).width > 600) {
		fontSize--;
		ctx.font = `400 ${fontSize}px Arial, sans-serif`;
	}
	const lines = await this.wrapText(ctx, text, 250);
	ctx.fillText(lines.join('\n'), 280,145);
	ctx.beginPath();

        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        fs.removeSync(avatar);
        return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
    }
};
