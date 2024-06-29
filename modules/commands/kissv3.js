const fs = require('fs');
const axios = require('axios');
const path = require('path');
const jimp = require('jimp');

// Function to create a kiss image
async function makeImage({ one, two }) {
    const fsExtra = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"]; 
    const __root = path.resolve(__dirname, "cache", "canvas");

    const batgiamImg = await jimp.read(__root + "/kissv3.png");
    const pathImg = __root + `/batman${one}_${two}.png`;
    const avatarOne = __root + `/avt_${one}.png`;
    const avatarTwo = __root + `/avt_${two}.png`;
    
    const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    
    const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    
    const circleOne = await jimp.read(await circle(avatarOne));
    const circleTwo = await jimp.read(await circle(avatarTwo));
    batgiamImg.composite(circleOne.resize(350, 350), 200, 300).composite(circleTwo.resize(350, 350), 600, 80);
    
    const raw = await batgiamImg.getBufferAsync(jimp.MIME_PNG);
    
    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);
    
    return pathImg;
}

// Function to create circular avatar
async function circle(image) {
    const jimpImg = await jimp.read(image);
    jimpImg.circle();
    return await jimpImg.getBufferAsync(jimp.MIME_PNG);
}

module.exports.config = {
    name: "kissv3",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "kiss",
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

module.exports.run = async function({ api, event, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const mention = Object.keys(event.mentions);
        if (!mention[0]) return api.sendMessage("Please mention 1 person.", threadID, messageID);
        else {
            const one = senderID, two = mention[0];
            return makeImage({ one, two }).then(path => api.sendMessage({ body: "", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
        }
    }
    //other command logic goes here
};
