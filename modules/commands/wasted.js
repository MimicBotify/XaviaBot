const fs = require('fs');
const axios = require('axios');
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
    name: "wasted",
    version: "1.0.1",
    hasPermission: 0,
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

module.exports.run = async function ({ api, event, args, Users }) {
    const { threadID, messageID, senderID, mentions } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (!args[0]) {
            var uid = senderID;
        }
        if (event.type == "message_reply") {
            uid = event.messageReply.senderID;
        }
        if (args.join().indexOf('@') !== -1) {
            var uid = Object.keys(event.mentions)[0];
        }

        const pathImg = __dirname + "/cache/wanted.png";
        const pathAva = __dirname + "/cache/avt.png";

        try {
            const Avatar = (
                await axios.get(
                    `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { responseType: "arraybuffer" }
                )
            ).data;
            fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));

            const getWasted = (
                await axios.get(`https://zenzapis.xyz/photoeditor/wasted?url=https://avatars.githubusercontent.com/u/68224412?v=4&apikey=7990c7f07144`, {
                    responseType: "arraybuffer",
                })
            ).data;
            fs.writeFileSync(pathImg, Buffer.from(getWasted, "utf-8"));

            const baseImage = await loadImage(pathImg);
            const baseAva = await loadImage(pathAva);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
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
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while processing the command.", threadID, messageID);
        }
    }
    // other command logic goes here
};
