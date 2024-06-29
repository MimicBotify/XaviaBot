const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');
const jimp = require('jimp');

module.exports.config = {
    name: "slapv2",
    version: "2.2.4",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "",
    commandCategory: "general",
    usages: "[@tag]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    },
    envConfig: {
        APIKEY: ""
    }
};

module.exports.onLoad = async () => {
    const { downloadFile } = global.utils;
    const dirMaterial = path.join(__dirname, 'cache', 'canvas');
    const slapImagePath = path.join(__dirname, 'cache', 'canvas', 'slap.png');

    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(slapImagePath)) await downloadFile("https://git.meewmeew.info/data/slap.png", slapImagePath);
}

async function makeImage({ one, two }) {
    const { APIKEY } = global.configModule.slapv2;
    const __root = path.resolve(__dirname, "cache", "canvas");
    
    let slap_image = await jimp.read(path.join(__root, "slap.png"));
    let pathImg = path.join(__root, `slap_${one}_${two}.png`);

    let avatarOne = (await axios.get(`https://meewmeew.info/avatar/${one}?apikey=${APIKEY}`)).data;
    let avatarTwo = (await axios.get(`https://meewmeew.info/avatar/${two}?apikey=${APIKEY}`)).data;
    
    let circleOne = await jimp.read(await circle(Buffer.from(avatarOne, 'utf-8')));
    let circleTwo = await jimp.read(await circle(Buffer.from(avatarTwo, 'utf-8')));
    
    slap_image.composite(circleOne.resize(150, 150), 745, 25).composite(circleTwo.resize(140, 140), 180, 40);
    
    let raw = await slap_image.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, raw);
    return pathImg;
}

async function circle(image) {
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const mention = Object.keys(mentions);
        if (!mention[0]) {
            return api.sendMessage("Please tag 1 person.", threadID, messageID);
        } else {
            const one = senderID, two = mention[0];
            return makeImage({ one, two }).then(path => {
                api.sendMessage({ body: "Toang ALO nè", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
            });
        }
    }
}
