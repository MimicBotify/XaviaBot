const fs = require('fs');
const axios = require('axios');
const request = global.nodemodule["request"];

//module export goes here
module.exports.config = {
    name: "pubg",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "create pubg banner",
    commandCategory: "image",
    usages: "text1 | text2",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let text = args.join(" ");
        const text1 = text.substr(0, text.indexOf(' | ')); 
        const text2 = text.split(" | ").pop();
        
        const callback = () => api.sendMessage({ body: ``, attachment: fs.createReadStream(__dirname + "/cache/biden.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/biden.png"), event.messageID);
        
        return request(encodeURI(`https://betabotz-api.herokuapp.com/api/photooxy/pubg?text=${text1}&text2=${text2}&apikey=BetaBotz`))
            .pipe(fs.createWriteStream(__dirname+'/cache/biden.png'))
            .on('close', () => callback());
    }
    //other command logic goes here
};
