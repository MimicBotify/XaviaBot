const fs = global.nodemodule["fs-extra"];
const axios = global.nodemodule["axios"];
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
    name: "adden",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "White brother :v",
    commandCategory: "Edit-IMG",
    usages: "[text 1] | [text 2]",
    cooldowns: 10
};

module.exports.wrapText = /* ... */ // The wrapText function remains unchanged

module.exports.run = async function ({ api, event, args, Users }) {
    const { threadID, messageID, senderID } = event;
    const pathImg = __dirname + `/cache/anhdaden.png`;
    const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    }

    try {
        const getImage = await axios.get(encodeURI(`https://i.imgur.com/2ggq8wM.png`), { responseType: "arraybuffer" });
        fs.writeFileSync(pathImg, Buffer.from(getImage.data, "utf-8"));

        if (!fs.existsSync(__dirname + '/cache/SVN-Arial 2.ttf')) {
            const getFont = await axios.get(`https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download`, { responseType: "arraybuffer" });
            fs.writeFileSync(__dirname + "/cache/SVN-Arial 2.ttf", Buffer.from(getFont.data, "utf-8"));
        }

        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        Canvas.registerFont(__dirname + `/cache/SVN-Arial 2.ttf`, { family: "SVN-Arial 2" });
        ctx.font = "30px SVN-Arial 2";
        ctx.fillStyle = "#000077";
        ctx.textAlign = "center";

        const wrapText = async (text, y) => {
            const lines = await this.wrapText(ctx, text, 464);
            ctx.fillText(lines.join("\n"), 170, y);
        };

        await wrapText(text[0], 129);
        await wrapText(text[1], 440);

        ctx.beginPath();
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
    } catch (error) {
        console.error('Error occurred:', error);
        api.sendMessage("An error occurred while processing your request.", threadID, messageID);
    }
};
