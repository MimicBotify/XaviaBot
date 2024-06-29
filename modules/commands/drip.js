const fs = require('fs');
const axios = require('axios');
const { loadImage, createCanvas } = require("canvas");
const jimp = global.nodemodule["jimp"];

// Function to create a circular image
module.exports.circle = async (image) => {
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.config = {
    name: "drip",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "drip",
    commandCategory: "image",
    cooldowns: 3,
    dependencies: {
        canvas: "",
        axios: "",
        "fs-extra": "",
    },
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const fs = global.nodemodule["fs-extra"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let pathImg = __dirname + `/cache/${event.threadID}_${event.senderID}.png`;
        let pathAva = __dirname + `/cache/a${event.senderID}.png`;

        // Fetching avatar and converting it to a circular image
        let Avatar = (
            await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
        ).data;
        fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
        avatar = await this.circle(pathAva);

        // Fetching the base image and overlaying the avatar on it
        let getWanted = (
            await axios.get(`https://api.popcat.xyz/drip?image=https://i.imgur.com/e3YvQWP.jpg`, { responseType: "arraybuffer" })
        ).data;
        fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

        let baseImage = await loadImage(pathImg);
        let baseAva = await loadImage(avatar);

        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseAva, 320, 80, 239, 239);
        ctx.beginPath();

        // Sending the modified image
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        fs.removeSync(pathAva);

        return api.sendMessage(
            { attachment: fs.createReadStream(pathImg) },
            threadID,
            () => fs.unlinkSync(pathImg),
            messageID
        );
    }
    // Other command logic goes here
}
