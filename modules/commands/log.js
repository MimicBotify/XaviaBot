const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "log",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "log",
    commandCategory: "System",
    usages: "",
    cooldowns: 3,
    denpendencies: {}
};

module.exports.run = async function ({ api, event, Threads, getText }) {
    const fs = global.nodemodule["fs-extra"];
    module.exports.run = async function({ api, event, args, Currencies, getText }) {
        const { threadID, messageID, senderID, mentions } = event;
        const fs = global.nodemodule["fs-extra"];
        const axios = global.nodemodule["axios"];

        const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
        const isActivated = activatedTokens.some(token => token.threadID === threadID);

        if (!isActivated) {
            return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
        } else {
            var { threadID, messageID, senderID } = event;
            
            var dataThread = (await Threads.getData(threadID));
            var data = dataThread.data;

            var rankup = data.rankup || 'false';
            var resend = data.resend || 'false';
            var log = data.log || 'true';
            var tagadmin = data.tagadmin || 'true';
            var guard = data.guard || 'true';
            var antiout = data.antiout || 'true';
            
            return api.sendMessage(`ᅠᅠ☣️Table ☣️ \n\n\n🍄────•🦋• ────🍄\n❯ 🍉 Log: ${log}\n❯ 🍇 Rankup: ${rankup}\n❯ 🍓 Resend: ${resend}\n❯ 🥕 Tag admin: ${tagadmin}\n❯ 🍑 Antirobbery ${guard}\n❯ 🍒 Antiout: ${antiout}\n🍄────•🦋• ────🍄`, threadID, messageID);
        }
        //other command logic goes here
    }
}
