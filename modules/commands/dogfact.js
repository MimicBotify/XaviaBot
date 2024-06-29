const fs = require('fs');
const axios = require('axios');
const request = require('request');
const fsExtra = global.nodemodule["fs-extra"];

module.exports.config = {
    name: "dogfact",
    version: "1.0.0",
    hasPermision: 0,
    credit: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "image",
    commandCategory: "random-img",
    cooldowns: 0,
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            const res = await axios.get(`https://some-random-api.ml/animal/dog`);
            const data = res.data;

            const callback = () => {
                return api.sendMessage({
                    body: `Fact: ${data.fact}`,
                    attachment: fsExtra.createReadStream(__dirname + `/cache/image.png`)
                }, event.threadID, () => fsExtra.unlinkSync(__dirname + `/cache/image.png`), event.messageID);
            };

            return request(encodeURI(data.image))
                .pipe(fsExtra.createWriteStream(__dirname + `/cache/image.png`))
                .on("close", callback);
        } catch (err) {
            console.log(err);
            return api.sendMessage(`Error`, event.threadID);
        }
    }
    //other command logic goes here
};
