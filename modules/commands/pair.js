const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "pair",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Pairing",
    commandCategory: "Love",
    usages: "pair",
    cooldowns: 40
};

module.exports.run = async function ({ api, event }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        const { threadInfo: { participantIDs } } = await Threads.getData(event.threadID);
        const botID = api.getCurrentUserID();
        const listUserID = participantIDs.filter(ID => ID !== botID && ID !== event.senderID);

        if (listUserID.length < 2) {
            return api.sendMessage("Not enough participants to pair.", event.threadID, event.messageID);
        }

        const randomIndexes = [Math.floor(Math.random() * listUserID.length), Math.floor(Math.random() * listUserID.length)];
        const [senderIndex, pairIndex] = randomIndexes;
        const senderID = listUserID[senderIndex];
        const pairID = listUserID[pairIndex];

        const senderName = (await Users.getData(senderID)).name;
        const pairName = (await Users.getData(pairID)).name;

        const pairPercent = Math.floor(Math.random() * 101);

        const arraytag = [
            { id: event.senderID, tag: senderName },
            { id: pairID, tag: pairName }
        ];

        const [avatar1, gifLove, avatar2] = await Promise.all([
            axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
            axios.get(`https://i.ibb.co/wC2JJBb/trai-tim-lap-lanh.gif`, { responseType: "arraybuffer" }),
            axios.get(`https://graph.facebook.com/${pairID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
        ]);

        fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(avatar1.data, "utf-8"));
        fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove.data, "utf-8"));
        fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(avatar2.data, "utf-8"));

        const imglove = [
            fs.createReadStream(__dirname + "/cache/avt.png"),
            fs.createReadStream(__dirname + "/cache/giflove.png"),
            fs.createReadStream(__dirname + "/cache/avt2.png")
        ];

        const msg = {
            body: `🥰Successful pairing!\n💌Wish you two hundred years of happiness\n💕Double ratio: ${pairPercent}%\n${senderName} 💓 ${pairName}`,
            mentions: arraytag,
            attachment: imglove
        };

        return api.sendMessage(msg, event.threadID, event.messageID);
    }
    // other command logic goes here
};
