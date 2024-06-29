const fs = require('fs');
const axios = require('axios');
const { createReadStream, unlinkSync } = require('fs-extra');
const { join } = require('path');

module.exports.config = {
    name: "meme",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "random meme",
    commandCategory: "random-img",
    cooldowns: 1,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "path": ""
    }
};

module.exports.run = async function ({ api, event }) {
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        try {
            const response = await axios.get("https://meme-api.herokuapp.com/gimme/memes");
            const content = response.data;
            
            const path = join(__dirname, "cache", `${event.threadID}-${event.senderID}-meme.jpg`);
            const imageResponse = await axios.get(content.url, { responseType: 'stream' });
            imageResponse.data.pipe(fs.createWriteStream(path));

            imageResponse.data.on('end', () => {
                api.sendMessage({ body: `${content.title}`, attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path), event.messageID);
            });
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while fetching the meme.", event.threadID, event.messageID);
        }
    }
    // Other command logic goes here
};
