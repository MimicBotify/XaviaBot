const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "imgsearch",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Image Search",
    commandCategory: "Công Cụ",
    usages: "[Text]",
    cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    }

    const keySearch = args.join(" ");
    if (!keySearch.includes("-")) {
        return api.sendMessage('Please enter in the format: keyword to search - number of photos to search', event.threadID, event.messageID);
    }

    const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
    const numberSearch = keySearch.split("-").pop().trim() || 6;

    try {
        const res = await axios.get(`https://api.ndtmint.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`);
        const data = res.data.data;
        
        var imgData = [];
        for (let i = 0; i < parseInt(numberSearch); i++) {
            const path = __dirname + `/cache/${i + 1}.jpg`;
            const getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
            imgData.push(fs.createReadStream(__dirname + `/cache/${i + 1}.jpg`));
        }

        api.sendMessage({
            attachment: imgData,
            body: `${numberSearch} Keyword search results: ${keySearchs}`
        }, event.threadID, event.messageID);

        for (let i = 1; i <= parseInt(numberSearch); i++) {
            fs.unlinkSync(__dirname + `/cache/${i}.jpg`);
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage("An error occurred while fetching image data.", event.threadID, event.messageID);
    }
};
