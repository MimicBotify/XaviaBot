const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "zuck",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Comment on the board ( ͡° ͜ʖ ͡°)",
    commandCategory: "edit-img",
    usages: "zuck [text]",
    cooldowns: 10,
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.wrapText = (ctx, text, maxWidth) =>  {
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

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let pathImg = __dirname + '/cache/trump.png';
        let text = args.join(" ");

        if (!text) return api.sendMessage("Enter the content of the comment on the board", threadID, messageID);

        try {
            let getImage = await axios.get(`https://i.postimg.cc/gJCXgKv4/zucc.jpg`, { responseType: 'arraybuffer' });
            fs.writeFileSync(pathImg, Buffer.from(getImage.data, 'utf-8'));

            const { loadImage, createCanvas } = require("canvas");
            let baseImage = await loadImage(pathImg);
            let canvas = createCanvas(baseImage.width, baseImage.height);
            let ctx = canvas.getContext("2d");

            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.font = "400 18px Arial";
            ctx.fillStyle = "#000000";
            ctx.textAlign = "start";

            let fontSize = 50;
            while (ctx.measureText(text).width > 1200) {
                fontSize--;
                ctx.font = `400 ${fontSize}px Arial`;
            }

            const lines = await this.wrapText(ctx, text, 470);
            ctx.fillText(lines.join('\n'), 15, 75); // Comment position

            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, imageBuffer);

            return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while processing the request.", threadID, messageID);
        }
    }
}
