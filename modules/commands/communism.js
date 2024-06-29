const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "communism",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "communism",
    commandCategory: "banner",
    cooldowns: 2,
    dependencies: {
        canvas: "",
        axios: "",
        "fs-extra": "",
    },
};

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let uid = senderID;
        if (event.type === "message_reply") {
            uid = event.messageReply.senderID;
        }
        if (args.join().includes('@')) {
            uid = Object.keys(event.mentions)[0];
        }

        let pathImg = __dirname + "/cache/wanted.png";
        let pathAva = __dirname + "/cache/avt.png";

        let Avatar = (
            await axios.get(
                `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                { responseType: "arraybuffer" }
            )
        ).data;

        fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));

        let getWanted = (
            await axios.get(`https://api.popcat.xyz/communism?image=https://i.imgur.com/M3uK4Ej.jpg`, {
                responseType: "arraybuffer",
            })
        ).data;

        fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

        let baseImage = await loadImage(pathImg);
        let baseAva = await loadImage(pathAva);

        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");

        ctx.drawImage(baseAva, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.beginPath();

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
};
