const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "idst",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Save sticker id",
    commandCategory: "sticker",
    usages: "[reply]",
    cooldowns: 5   
}
  
module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (event.type == "message_reply") {
            if (event.messageReply.attachments[0].type == "sticker") {
                return api.sendMessage({
                    body: `ID: ${event.messageReply.attachments[0].ID}\nCaption: ${event.messageReply.attachments[0].description}`
                }, event.threadID)
            } else {
                return api.sendMessage("Only reply with a sticker", event.threadID);
            }
        } else if (args[0]) {
            return api.sendMessage({ body: `Here is the sticker`, sticker: args[0] }, event.threadID);
        } else {
            return api.sendMessage("Please reply with a sticker or provide the sticker's ID.", event.threadID);
        }
    }
    //other command logic goes here
}
