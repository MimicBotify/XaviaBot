const fs = require('fs');
const request = require('request');

module.exports.config = {
    name: "Getavtfb",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "lấy avt người dùng bằng id",
    commandCategory: "system",
    cooldowns: 0
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
        if (!args[0]) {
            return api.sendMessage(`» » » FB-AVATAR « « «\n\n${prefix}fbavt id [id to get] <get photo by person uid>\n\n${prefix}fbavt link [link to get] <get by that person's link>\n\n${prefix}fbavt user <Leave it blank to get the user's own avatar>\n\n${prefix}fbavt user [@mentions] <get avatars of people tagged>`, threadID, messageID);
        } else if (args[0] == "id") {
            try {
                var id = args[1];
                if (!id) return api.sendMessage(`Please enter the uid to get avatar.`, threadID, messageID);
                var callback = () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/1.png") }, threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), messageID);
                return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
            } catch (e) {
                api.sendMessage(`Can't get user photo.`, threadID, messageID);
            }
        } else if (args[0] == "link") {
            var link = args[1];
            if (!link) return api.sendMessage(`Please enter the link to get avatar.`, threadID, messageID);
            var tool = require("fb-tools");
            try {
                var id = await tool.findUid(args[1] || event.messageReply.body);
                var callback = () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/1.png") }, threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), messageID);
                return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
            } catch (e) {
                api.sendMessage("User does not exist.", threadID, messageID)
            }
        } else if (args[0] == "user") {
            if (!args[1]) {
                var id = senderID;
                var callback = () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/1.png") }, threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), messageID);
                return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
            } else if (args.join().indexOf('@') !== -1) {
                var mention = Object.keys(event.mentions);
                var callback = () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/1.png") }, threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), messageID);
                return request(encodeURI(`https://graph.facebook.com/${mentions}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
            } else {
                api.sendMessage("Wrong order. Take note `/fbavt` to view module commands.", threadID, messageID);
            }
        } else {
            api.sendMessage("Wrong order. Take note `/fbbavt` to view module commands.", threadID, messageID);
        }
    }
}
