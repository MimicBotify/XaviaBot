const fs = require('fs');
const axios = require('axios');
const { resolve } = global.nodemodule["path"];
const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
const { downloadFile } = global.utils;

// onLoad function for preparing image material
module.exports.onLoad = async () => {
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'pairing.jpg');

    if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg", path);
}

// Function to create the image for shipping users
async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"]; 
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    let pairing_img = await jimp.read(__root + "/pairing.jpg");
    let pathImg = __root + `/pairing_${one}_${two}.png`;
    let avatarOne = __root + `/avLt_${one}.png`;
    let avatarTwo = __root + `/avLt_${two}.png`;
    
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    pairing_img.composite(circleOne.resize(85, 85), 355, 100).composite(circleTwo.resize(75, 75), 250, 140);
    
    let raw = await pairing_img.getBufferAsync("image/png");
    
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

module.exports.config = module.exports.config = {
	name: "ship",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
	description: "random",
	commandCategory: "love",
	cooldowns: 5,
	dependencies: {
        "axios": "",
        "fs-extra": ""
    }
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    // Check group activation
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        // Rest of your command logic...
        var tl = ['21%', '67%', /* ... */, "48%"];
        var tle = tl[Math.floor(Math.random() * tl.length)];

        // Getting user information and initiating the ship
        let dataa = await api.getUserInfo(event.senderID);
        let namee = await dataa[event.senderID].name;
        let loz = await api.getThreadInfo(event.threadID);
        var emoji = loz.participantIDs;
        var id = emoji[Math.floor(Math.random() * emoji.length)];
        let data = await api.getUserInfo(id);
        let name = await data[id].name;

        // Form the array for mentions and other user information
        var arraytag = [];
        arraytag.push({id: event.senderID, tag: namee});
        arraytag.push({id: id, tag: name});
        var sex = await data[id].gender;
        var gender = sex == 2 ? "Male🧑" : sex == 1 ? "Female👩‍  " : "Tran Duc Bo";
        var one = senderID, two = id;

        // Generate image and send the result
        return makeImage({ one, two }).then(path => api.sendMessage({ body: `congratulations ${namee} has been ship with ${name}\n\nromance: ${tle}`, mentions: arraytag, attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
    }
}
