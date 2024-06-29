const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "tile", 
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "See the match ratio between 2 people",
    commandCategory: "Game",
    usages: "[tag]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.run = async function({ api, event, args, Users }) {
    const { threadID, messageID, senderID, mentions } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const mention = Object.keys(event.mentions)[0];
        if (!mention) return api.sendMessage("Need to tag 1 friend you want to see the matching ratio", event.threadID);

        const userData = await Users.getData(mention);
        const friendName = userData.name;
        
        const senderData = await Users.getData(senderID);
        const senderName = senderData.name;
        
        const matchRatio = Math.floor(Math.random() * 101);
    
        const arrayTags = [
            { id: mention, tag: friendName },
            { id: senderID, tag: senderName }
        ];
        
        const [avatar1, avatar2] = await Promise.all([
            axios.get(`https://graph.facebook.com/${mention}/picture?height=720&width=720&access_token=1073911769817594|aa417da57f9e260d1ac1ec4530b417de`, { responseType: "arraybuffer" }),
            axios.get(`https://graph.facebook.com/${senderID}/picture?height=720&width=720&access_token=1073911769817594|aa417da57f9e260d1ac1ec4530b417de`, { responseType: "arraybuffer" })
        ]);

        fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(avatar1.data, "utf-8"));
        fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(avatar2.data, "utf-8"));        
    
        const imgLove = [
            fs.createReadStream(__dirname + "/cache/avt2.png"),
            fs.createReadStream(__dirname + "/cache/avt.png")
        ];

        const msg = {
            body: `⚡️The love ratio between ${senderName} and ${friendName} is ${matchRatio}% 🥰`,
            mentions: arrayTags,
            attachment: imgLove
        };

        return api.sendMessage(msg, event.threadID, event.messageID);
    }
};
