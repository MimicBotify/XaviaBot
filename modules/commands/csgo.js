const fs = require('fs');
const axios = require('axios');
const tientrochoi = 1000;

module.exports.config = {
    name: "csgo",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "random câu hỏi về csgo",
    commandCategory: "Trò Chơi",
    usages: "",
    cooldowns: 0
};

module.exports.run = async function ({ api, args, event, Currencies, Users, client }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const { senderID, threadID, messageID } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let balance = (await Currencies.getData(senderID)).money;

        if (balance <= 5000) return api.sendMessage('Bạn quá nghèo nên không có tiền chơi đâu!', threadID, messageID);

        await Currencies.decreaseMoney(senderID, parseInt(tientrochoi));

        let res = (await axios.get(encodeURI(`https://ginxkin-api.herokuapp.com/api/csgo_quiz/random`))).data;
        let pubg = (await axios.get(`${res.link}`, { responseType: "arraybuffer" })).data;

        fs.writeFileSync(__dirname + "/cache/csgo.png", Buffer.from(pubg, "utf-8"));

        var namePlayer_react = await Users.getData(senderID);

        return api.sendMessage({
            body: `🌸====[𝐂𝐒𝐆𝐎 𝐐𝐔𝐈𝐙]====🌸\n\n${res.body}\n\nHãy trả lời chính xác để nhận được ${tientrochoi}$ choínha!`,
            attachment: fs.createReadStream(__dirname + `/cache/csgo.png`)
        }, threadID, async (err, info) => {
            client.handleReply.push({
                type: "random",
                name: this.config.name,
                senderID: senderID,
                messageID: info.messageID,
                replyID: messageID,
                threadID: threadID,
                answer_: res.answer
            }, messageID);

            await new Promise(resolve => setTimeout(resolve, 120));
        });
    }
};

module.exports.handleReply = async function ({ api, event, handleReply, Currencies }) {
    if (event.senderID == api.getCurrentUserID()) return;

    let { senderID, messageID, threadID, body } = event;
    let name = (await Users.getData(senderID)).name;

    var money = parseInt(Math.floor(Math.random() * 5000));

    switch (handleReply.type) {
        case "random": {
            if (body.toUpperCase() === handleReply.answer_) {
                return api.sendMessage({
                    body: `Chúc mừng, ${name} đã trả lời chính xác, bạn nhận được ${money}$!`
                }, handleReply.threadID, () => {
                    api.unsendMessage(handleReply.messageID);
                    Currencies.increaseMoney(senderID, money);
                });
            } else {
                return api.sendMessage({
                    body: `Rất tiếc, câu trả lời của bạn không chính xác!`
                }, handleReply.threadID, () => api.unsendMessage(handleReply.messageID));
            }
            handleReply.splice(0, 1);
        }
    }
};
