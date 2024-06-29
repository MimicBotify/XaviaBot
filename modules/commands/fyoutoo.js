const fs = require('fs-extra');
const axios = require('axios');

module.exports.config = {
    name: "fyoutoo",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "hihihihi",
    commandCategory: "no prefix",
    usages: "fuck",
    cooldowns: 5,
};

module.exports.handleEvent = function ({ event, api }) {
    var { threadID, messageID } = event;
	if (event.body.indexOf("fuck")==0 || event.body.indexOf("Fuck")==0 || event.body.indexOf("fuck you")==0 || event.body.indexOf("Fuck you")==0 || event.body.indexOf("pakyu")==0 || event.body.indexOf("Pakyu")==0 || event.body.indexOf("pak you")==0 || event.body.indexOf("Pak you")==0 || event.body.indexOf("pak u")==0 || event.body.indexOf("Pak u")==0 || event.body.indexOf("pak yu")==0 || event.body.indexOf("Pak yu")==0) {
		var msg = {
				body: "F you too",
				attachment: fs.createReadStream(__dirname + `/noprefix/fuck.gif`)
			}
			api.sendMessage(msg, threadID, messageID);
		}
	
};

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (event.body.indexOf("fuck") === 0 || event.body.indexOf("Fuck") === 0 || event.body.indexOf("fuck you") === 0 || event.body.indexOf("Fuck you") === 0 || event.body.indexOf("tomar nanit khalighor") === 0 || event.body.indexOf("Pakyu") === 0 || event.body.indexOf("pak you") === 0 || event.body.indexOf("Pak you") === 0 || event.body.indexOf("pak u") === 0 || event.body.indexOf("Pak u") === 0 || event.body.indexOf("pak yu") === 0 || event.body.indexOf("Pak yu") === 0) {
            var msg = {
                body: "Fuck you too",
                attachment: fs.createReadStream(__dirname + `/noprefix/fuck.gif`)
            };
            api.sendMessage(msg, threadID, messageID);
        }
    }
    // other command logic goes here
};
