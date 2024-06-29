const fs = require('fs');
const axios = require('axios');
const fsExtra = global.nodemodule["fs-extra"];

module.exports.config = {
    name: "dps",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Image search",
    commandCategory: "Search",
    usages: "[Text] - [number]",
    cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const keySearch = args.join(" ");
        if (!keySearch.includes("-")) {
            return api.sendMessage(`Please enter in the format, example: ${global.config.PREFIX}${this.config.name} images - 10 (it depends on you how many images you want to appear in the result)`, event.threadID, event.messageID);
        }

        const keySearchs = keySearch.substr(0, keySearch.indexOf('-'));
        const numberSearch = keySearch.split("-").pop() || 6;

        try {
            const res = await axios.get(`https://bot.api-johnlester.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`);
            const data = res.data.data;
            const imgData = [];

            for (let i = 0; i < parseInt(numberSearch); i++) {
                const path = __dirname + `/data/${i + 1}.jpg`;
                const getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
                fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
                imgData.push(fs.createReadStream(__dirname + `/data/${i + 1}.jpg`));
            }

            api.sendMessage({
                attachment: imgData,
                body: `${numberSearch} Search results for keyword: ${keySearchs}`
            }, event.threadID, event.messageID);

            for (let i = 1; i <= parseInt(numberSearch); i++) {
                fs.unlinkSync(__dirname + `/data/${i}.jpg`);
            }
        } catch (err) {
            console.error(err);
            return api.sendMessage(`Error`, event.threadID);
        }
    }
    //other command logic goes here
};
