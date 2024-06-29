const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "ping",
    version: "1.0.5",
    hasPermssion: 1,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "tag toàn bộ thành viên",
    commandCategory: "system",
    usages: "[Text]",
    cooldowns: 80
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mention } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            const botID = api.getCurrentUserID();
            var listAFK, listUserID;
            global.moduleData["afk"] && global.moduleData["afk"].afkList ? listAFK = Object.keys(global.moduleData["afk"].afkList || []) : listAFK = []; 
            listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
            listUserID = !listUserID.filter(item => !listAFK.includes(item));
            var body = (args.length != 0) ? args.join(" ") : "Dô đây coi có con đĩ làm loạn trong này nè anh em ơiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", mentions = [], index = 0;
            for(const idUser of listUserID) {
                body = "‎" + body;
                mentions.push({ id: idUser, tag: "‎", fromIndex: index - 1 });
                index -= 1;
            }
    
            return api.sendMessage({ body, mentions }, event.threadID, event.messageID);
    
        }
        catch (e) { 
            console.log(e);
            return api.sendMessage("Something went wrong.", threadID, messageID);
        }
      }
        //other command logic goes here
};
