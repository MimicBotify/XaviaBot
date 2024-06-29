const fs = require('fs');
const axios = require('axios');

// module export goes here
module.exports.config = {
    name: "imagesearch",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "lmao",
    commandCategory: "Other",
    usages: "",
    cooldowns: 0,
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            const res = await axios.get(`https://fatiharridho.herokuapp.com/api/search/wikimedia?query=${args.join(" ")}`);
            const data = res.data.result.slice(0, 9); // Limit to 9 images

            const imageAttachments = [];
            for (let i = 0; i < data.length; i++) {
                const imgData = await axios.get(data[i].image, { responseType: 'arraybuffer' });
                fs.writeFileSync(__dirname + `/cache/img${i + 1}.png`, Buffer.from(imgData.data, 'utf-8'));
                imageAttachments.push(fs.createReadStream(__dirname + `/cache/img${i + 1}.png`));
            }

            return api.sendMessage({
                body: `Showing 10 images result`,
                attachment: imageAttachments
            }, event.threadID);
        } catch (error) {
            console.log("Error: " + error);
            return api.sendMessage("An error occurred while fetching images.", event.threadID);
        }
    }
};
