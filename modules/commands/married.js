const fs = require('fs');
const axios = require('axios');
const { resolve } = global.nodemodule["path"];
const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
const { downloadFile } = global.utils;
const jimp = global.nodemodule["jimp"];

module.exports.config = {
    name: "married",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "married",
    commandCategory: "img",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'married.png');

    if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.ibb.co/PjWvsBr/13bb9bb05e53ee24893940892b411ad2.png", path);
};

async function makeImage({ one, two, api, event, fs }) {
    const __root = resolve(__dirname, "cache", "canvas");
    let batgiam_img = await jimp.read(__root + "/married.png");
    let pathImg = __root + `/batman${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;

    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    batgiam_img.composite(circleOne.resize(150, 150), 280, 45).composite(circleTwo.resize(150, 150), 130, 90);

    let raw = await batgiam_img.getBufferAsync("image/png");

    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

async function circle(image) {
    const imageJimp = await jimp.read(image);
    imageJimp.circle();
    return await imageJimp.getBufferAsync("image/png");
}

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const mention = Object.keys(event.mentions);
        if (!mention[0]) return api.sendMessage("Please mention 1 person.", threadID, messageID);
        else {
            const one = senderID, two = mention[0];
            return makeImage({ one, two, api, event, fs }).then(path => api.sendMessage({ body: "", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
        }
    }
};
