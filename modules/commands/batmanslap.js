const axios = require('axios');

module.exports.config = {
    name: "batmanslap",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "",
    commandCategory: "general",
    usages: "[tag]",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const mention = Object.keys(event.mentions)[0];
        if (!mention) return api.sendMessage("Please tag 1 person", threadID, messageID);
        else {
            const tag = event.mentions[mention].replace("@", "");
            const one = senderID;
            const two = mention;

            try {
                const path = await makeImage({ one, two });
                return api.sendMessage({
                    body: "shutup dude! " + tag,
                    mentions: [{
                        tag: tag,
                        id: mention
                    }],
                    attachment: fs.createReadStream(path)
                }, threadID, () => fs.unlinkSync(path), messageID);
            } catch (error) {
                console.error("Error creating image:", error);
                return api.sendMessage("An error occurred while creating the image.", threadID, messageID);
            }
        }
    }
};

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"]; 
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    let tromcho_img = await jimp.read(__root + "/batmanslap.jpg");
    let pathImg = __root + `/tromcho_${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;
    
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    tromcho_img.composite(circleOne.resize(160, 180), 370, 70).composite(circleTwo.resize(230, 250), 140, 150);
    
    let raw = await tromcho_img.getBufferAsync("image/png");
    
    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);
    
    return pathImg;
}
async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

