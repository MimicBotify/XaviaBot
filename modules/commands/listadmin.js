const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "listadmin",
    version: '1.0.0',
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "List of group administrators",
    commandCategory: "Box Chat",
    usages: "dsqtv",
    cooldowns: 5,
    dependencies: []
};

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        var threadInfo = await api.getThreadInfo(event.threadID);
        let qtv = threadInfo.adminIDs.length;
        var listad = '';
        var qtv2 = threadInfo.adminIDs;
        var fs = global.nodemodule["fs-extra"];
        dem = 1;
        for (let i = 0; i < qtv2.length; i++) {
            const info = (await api.getUserInfo(qtv2[i].id));
            const name = info[qtv2[i].id].name;
            listad += '' + `${dem++}` + '. ' + name + '\n';
        }

        api.sendMessage(
            `The list of ${qtv} administrators includes:\n${listad}`,
            event.threadID,
            event.messageID
        );
    };

    //other command logic goes here
};
