const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "astalk",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆", 
    description: "View information of Facebook users",
    commandCategory: "info",
    usages: "or reply to a message or @mention",
    cooldowns: 0 // Cooldown
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let uid;
        if (!args[0]) {
            if (event.type === "message_reply") uid = event.messageReply.senderID;
            else uid = event.senderID;
        } else {
            if (args.join().includes('@')) {
                var mentions = Object.keys(event.mentions);
                uid = mentions;
            } else {
                uid = args[0];
            }
        }
        const res = await axios.get(`https://manhict.tech/api/fbInfo?id=${uid}&apikey=lgG765KO`);
        const userData = res.data.result;
        const { id, name, firstName, vanity, birthday, follow, profileUrl, hometown, location, love, quotes, thumbSrc } = userData;

        const callback = () => {
            const body = `Name: ${name}\nFirst Name: ${firstName}\nFacebook Username: ${vanity}\nBirthday: ${birthday}\nFollowers: ${follow}\nLocation: ${location}\nRelationship: ${love}\nProfile Url: ${profileUrl}\nHometown: ${hometown}\nUID: ${id}`;
            api.sendMessage({
                body,
                attachment: fs.createReadStream(__dirname + "/cache/1.png")
            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
        };

        return request(encodeURI(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=463372798834978|csqGyA8VWtIhabZZt-yhEBStl9Y`))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', callback);
    }
    // Other command logic goes here
};
