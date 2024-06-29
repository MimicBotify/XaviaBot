const fs = require('fs');
const axios = require('axios');
const path = require('path');
const jimp = require('jimp');

module.exports.config = {
    name: "kiss",
    version: "2.0.0",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Kiss someone",
    commandCategory: "Love",
    usages: `Please tag 1 person\n\nHow to use?\n${global.config.PREFIX}kiss <@tag>\n\nExample:\n${global.config.PREFIX}kiss @name\n`,
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = path.join(__dirname, 'cache');
    const filePath = path.join(dirMaterial, 'hon.png');
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(filePath)) await downloadFile("https://i.imgur.com/BtSlsSS.jpg", filePath);
};

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const __root = path.resolve(__dirname, "cache");

    const hon_img = await jimp.read(path.join(__root, "/hon.png"));
    const pathImg = path.join(__root, `/hon_${one}_${two}.png`);
    const avatarOne = path.join(__root, `/avt_${one}.png`);
    const avatarTwo = path.join(__root, `/avt_${two}.png`);

    const getAvatar = async (id, avatarPath) => {
        const { data } = await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
        fs.writeFileSync(avatarPath, Buffer.from(data, 'utf-8'));
    };

    await Promise.all([getAvatar(one, avatarOne), getAvatar(two, avatarTwo)]);

    const circle = async (image) => {
        const imageFile = await jimp.read(image);
        imageFile.circle();
        return await imageFile.getBufferAsync("image/png");
    };

    const [circleOne, circleTwo] = await Promise.all([circle(avatarOne), circle(avatarTwo)]);
    hon_img.resize(700, 440).composite(await jimp.read(circleOne).resize(200, 200), 390, 23).composite(await jimp.read(circleTwo).resize(180, 180), 140, 80);

    const raw = await hon_img.getBufferAsync("image/png");

    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return { pathImg, raw };
}

module.exports.run = async function ({ api, event, Currencies }) {
    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const ae = ["💚 congrats ❤", "💙 congrats 💜"];
        const hc = Math.floor(Math.random() * 101) + 101;
        const rd = Math.floor(Math.random() * 10) + 1;
        const mention = Object.keys(event.mentions);
        const one = senderID;
        const two = mention[0];

        await Currencies.increaseMoney(event.senderID, parseInt(hc * rd));

        if (!two) return api.sendMessage(`Please tag 1 person\n\nHow to use?\n${global.config.PREFIX}kiss <@tag>\n\nExample:\n${global.config.PREFIX}kiss @name\n\nModded by ☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆`, threadID, messageID);
        else {
            const { pathImg, raw } = await makeImage({ one, two });
            return api.sendMessage({ body: `${ae[Math.floor(Math.random() * ae.length)]}\nYour sympathy after being stolen is ${hc} %\n + ${((hc) * rd)} $`, attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
        }
    }
};
