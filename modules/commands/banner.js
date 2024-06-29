const fs = require('fs');
const axios = require('axios');
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
    name: "banner",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Generates banner with lots of characters available",
    commandCategory: "game",
    usages: "{number}|{name1}|{name2}|{name3}|{color}",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const text1 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[0] || "21";
    const text2 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[1] || "";
    const text3 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[2] || "";
    const text4 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[3] || "";
    const color = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[4] || "";

    const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
    
    const { threadID, messageID, senderID, mentions } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            const pathImg = __dirname + `/tad/avatar_1.png`;
            const pathAva = __dirname + `/tad/avatar_2.png`;

            const avtAnime = (await axios.get(encodeURI(`${lengthchar[text1 - 1].imgAnime}`), { responseType: "arraybuffer" })).data;
            fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));

            const background = (await axios.get(encodeURI(`https://imgur.com/Ch778s2.png`), { responseType: "arraybuffer" })).data;
            fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));

            if (!fs.existsSync(__dirname + `/tad/PastiOblique-7B0wK.otf`)) {
                const getfon2t = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/PastiOblique-7B0wK.otf`, { responseType: "arraybuffer" })).data;
                fs.writeFileSync(__dirname + `/tad/PastiOblique-7B0wK.otf`, Buffer.from(getfon2t, "utf-8"));
            }

            if (!fs.existsSync(__dirname + `/tad/gantellinesignature-bw11b.ttf`)) {
                const getfon3t = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/gantellinesignature-bw11b.ttf`, { responseType: "arraybuffer" })).data;
                fs.writeFileSync(__dirname + `/tad/gantellinesignature-bw11b.ttf`, Buffer.from(getfon3t, "utf-8"));
            }

            if (!fs.existsSync(__dirname + `/tad/UTM%20Bebas.ttf`)) {
                const getfon3t2 = (await axios.get(`https://github.com/hanakuUwU/font/blob/main/UTM%20Bebas.ttf?raw=true`, { responseType: "arraybuffer" })).data;
                fs.writeFileSync(__dirname + `/tad/UTM%20Bebas.ttf`, Buffer.from(getfon3t2, "utf-8"));
            }

            const color_ = (color.toLowerCase() === "no" || !color) ? lengthchar[text1 - 1].colorBg : color;

            const a = await loadImage(pathImg);
            const ab = await loadImage(pathAva);
            const canvas = createCanvas(a.width, a.height);
            const ctx = canvas.getContext("2d");

            ctx.fillStyle = "#e6b030";
            ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(ab, 1500, -400, 1980, 1980);

            Canvas.registerFont(__dirname + `/tad/PastiOblique-7B0wK.otf`, { family: "PastiOblique-7B0wK" });
            ctx.fillStyle = color_;
            ctx.font = "370px PastiOblique-7B0wK";
            ctx.fillText(text2, 500, 750);

            Canvas.registerFont(__dirname + `/tad/gantellinesignature-bw11b.ttf`, { family: "gantellinesignature-bw11b" });
            ctx.fillStyle = "#fff";
            ctx.font = "350px gantellinesignature-bw11b";
            ctx.fillText(text3, 500, 680);

            Canvas.registerFont(__dirname + `/tad/UTM%20Bebas.ttf`, { family: "Bebas" });
            ctx.textAlign = "end";
            ctx.fillStyle = "#f56236";
            ctx.font = "145px PastiOblique-7B0wK";
            ctx.fillText(text4, 2100, 870);

            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, imageBuffer);

            api.sendMessage({
                body: `Here's Your Photo`,
                attachment: fs.createReadStream(pathImg)
            }, event.threadID, () => {
                fs.unlinkSync(pathImg);
                fs.unlinkSync(pathAva);
            }, event.messageID);

        } catch (error) {
            console.error(error);
            api.sendMessage("An error occurred while processing your request.", threadID, messageID);
        }
    }
};
