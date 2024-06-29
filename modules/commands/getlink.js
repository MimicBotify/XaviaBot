const fs = require('fs');

module.exports.config = {
    name: "getlink",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Get the URL Download from Video, Audio is sent from the group",
    commandCategory: "Tool",
    usages: "getLink",
    cooldowns: 5,
};

module.exports.languages = {
    "vi": {
        "invalidFormat": "❌ Tin nhắn bạn phản hồi phải là một audio, video, ảnh nào đó"
    },
    "en": {
        "invalidFormat": "❌ Your need reply a message have contain an audio, video or picture"
    }
}

module.exports.run = async function({ api, event, getText }) {
    const { threadID, messageID } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length !== 1) {
            const text = getText("invalidFormat");
            return api.sendMessage(text, threadID, messageID);
        }
        return api.sendMessage(event.messageReply.attachments[0].url, threadID, messageID);
    }
    // Other command logic goes here if needed
}
