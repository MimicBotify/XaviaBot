const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "poll",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Tạo bình chọn",
    commandCategory: "Group",
    usages: "poll title ->  [name1 | name2 | ...]",
    cooldowns: 5,
    dependencies: {
        "request": "",
        "fs-extra": ""
    }
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        var content = args.join(' ')
        var title = args[0];
        var options = content.substring(content.indexOf(" -> ") + 4)
    
        var option = options.split(" | ");
        var object = {};
        if (option.length == 1 && option[0].includes(' | ')) option[0] = option[0].replace(' | ', ' ');
        for (var i = 0; i < option.length; i++) object[option[i]] = false;
        return api.createPoll(title, event.threadID, object, (err) => (err) ? api.sendMessage('error', event.threadID, event.messageID) : '');
    }
    
    //other command logic goes here
};
