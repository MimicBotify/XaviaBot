const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "kick",
    version: "1.0.1",
    hasPermission: 1,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Clear the person you need to remove from the group by tag",
    commandCategory: "System",
    usages: "[tag]",
    cooldowns: 0,
};

module.exports.languages = {
    "vi": {
        "error": "Đã có lỗi xảy ra, vui lòng thử lại sau",
        "needPermssion": "Cần quyền quản trị viên nhóm\nVui lòng thêm và thử lại!",
        "missingTag": "Bạn phải tag người cần kick"
    },
    "en": {
        "error": "Error! An error occurred. Please try again later!",
        "needPermssion": "Need group admin\nPlease add and try again!",
        "missingTag": "You need tag some person to kick"
    }
};

module.exports.run = async function({ api, event, getText, Threads }) {
    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            let dataThread = (await Threads.getData(event.threadID)).threadInfo;
            if (!dataThread.adminIDs.some(item => item.id === api.getCurrentUserID())) return api.sendMessage(getText("needPermssion"), event.threadID, event.messageID);
            if (!mentions[0]) return api.sendMessage(getText("missingTag"), event.threadID);

            mentions.forEach(userID => {
                setTimeout(() => {
                    api.removeUserFromGroup(userID, event.threadID);
                }, 3000);
            });
        } catch {
            return api.sendMessage(getText("error"), event.threadID);
        }
    }
    // other command logic goes here
};
