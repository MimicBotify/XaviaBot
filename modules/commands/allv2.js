const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "allv2",
    version: "0.0.3",
    hasPermssion: 1,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Tag all members",
    commandCategory: "system",
    usages: "[Text]",
    cooldowns: 80
};

module.exports.run = async function({ api, event, args, Threads }) {
    const { threadID, messageID, senderID, mention } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            var all = (await Threads.getInfo(event.threadID)).participantIDs;
            all.splice(all.indexOf(api.getCurrentUserID()), 1);
            all.splice(all.indexOf(event.senderID), 1);
            var body = (args.length != 0) ? args.join(" ") : "Admin mentioned you ";
            var mentions = [];
            
            for (let i = 0; i < all.length; i++) {
                if (i == body.length) body += body.charAt(body.length - 1);
                mentions.push({
                    tag: body[i],
                    id: all[i],
                    fromIndex: i - 1
                });
            }
    
            return api.sendMessage({ body: `‎${body}`, mentions }, event.threadID, event.messageID);
    
        }
        catch (e) { 
            return console.log(e); 
        }
        //other command logic goes here
    }
};
