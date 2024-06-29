const fs = require('fs-extra');
const axios = require('axios');

module.exports.config = {
    name: "check",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Check rank",
    commandCategory: "rank",
    usages: `${global.config.PREFIX}check <all or blank>`,
    cooldowns: 5
};

module.exports.onLoad = function () {
    const pathA = require('path');
    const path = pathA.join(__dirname, 'cache', 'checktt.json');
    if (!fs.existsSync(path)) {
        const obj = [];
        fs.writeFileSync(path, JSON.stringify(obj, null, 4));
    }
};

module.exports.handleEvent = async ({ event, Users }) => {
    if (!event.isGroup) return;

    const pathA = require('path');
    const path = pathA.join(__dirname, 'cache', 'checktt.json');
    const thread = require('./cache/checktt.json');

    if (thread.some(i => i.threadID == event.threadID) == false) {
        const data = [];
        for (let user of event.participantIDs) {
            const name = (await Users.getData(user)).name;
            const id = user;
            const exp = 0;
            if (name !== undefined && name != 'Facebook user') {
                data.push({ name, id, exp });
            }
        }
        thread.push({ threadID: event.threadID, data });
        fs.writeFileSync(path, JSON.stringify(thread, null, 2));
    } else {
        const threadData = thread.find(i => i.threadID == event.threadID && i.threadID !== undefined);
        if (threadData.data.some(i => i.id == event.senderID) == false) {
            const name = (await Users.getData(event.senderID)).name;
            const id = event.senderID;
            const exp = 0;
            threadData.data.push({ name, id, exp });
            fs.writeFileSync(path, JSON.stringify(thread, null, 2));
        } else {
            const userData = threadData.data.find(i => i.id == event.senderID);
            userData.exp = userData.exp + 1;
            fs.writeFileSync(path, JSON.stringify(thread, null, 2));
        }
    }
};

module.exports.run = async function ({ args, api, event }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, senderID, messageID, type, mentions } = event;
    const thread = require('./cache/checktt.json');
    const data = thread.find(i => i.threadID == threadID);

    if (!data) return;

    if (args[0] == "all") {
        const exp = data.data.map(user => ({ name: user.name, exp: user.exp, id: user.id }));
        exp.sort((a, b) => b.exp - a.exp);

        const limit = args[2] || 20;
        let page = parseInt(args[1]) || 1;
        if (page < -1) page = 1;

        let msg = "Ranking list:\n\n";
        const numPage = Math.ceil(exp.length / limit);

        for (let i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
            if (i >= exp.length) break;
            const dataInfo = exp[i];
            msg += `${i + 1}: ${dataInfo.name}: ${dataInfo.exp} messages\n`;
        }
        msg += `\nPage: ${page}/${numPage}`;
        return api.sendMessage(msg, threadID, messageID);
    } else {
        const mention = Object.keys(mentions);
        const exp = data.data.map(user => ({ name: user.name, exp: user.exp, id: user.id }));
        exp.sort((a, b) => b.exp - a.exp);
        const count = exp.reduce((acc, val) => acc + val.exp, 0);

        let targetID = senderID;
        if (type == "message_reply" && mention[0]) targetID = event.messageReply.senderID;

        const rank = exp.findIndex(i => i.id == targetID);
        const ZiaRein = (`Name: ${exp[rank].name}\nRank: ${rank + 1}\nNumber of messages: ${exp[rank].exp}\nInteraction rate: ${(exp[rank].exp / count * 100).toFixed(0)}%`);

        const link = [
            "https://i.imgur.com/H8Hzv9Q.jpg",
            "https://i.imgur.com/GFq107h.jpg",
            "https://i.imgur.com/C5HUDm3.jpg",
            "https://i.imgur.com/2gVIhe4.jpg",
            "https://i.imgur.com/ifDgTOV.jpg",
            "https://i.imgur.com/dpvjG2x.jpg",
            "https://i.imgur.com/H8Hzv9Q.jpg",
            "https://i.imgur.com/GFq107h.jpg",
            "https://i.imgur.com/C5HUDm3.jpg",
            "https://i.imgur.com/2gVIhe4.jpg",
            "https://i.imgur.com/ifDgTOV.jpg",
            "https://i.imgur.com/dpvjG2x.jpg",
        ];

        const callback = () => api.sendMessage({ body: ZiaRein, attachment: fs.createReadStream(__dirname + "/cache/ZiaReinC.jpg") }, threadID, () => fs.unlinkSync(__dirname + "/cache/ZiaReinC.jpg"), event.messageID);
        return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/ZiaReinC.jpg")).on("close", () => callback());
    }
};
