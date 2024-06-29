const axios = require('axios');

module.exports.config = {
    name: "baybayin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "convert text to baybayin",
    commandCategory: "Phương tiện",
    usages: "baybayin [text]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const timkiem = args.join(" ");
    const res = await axios.get(`https://api-baybayin-transliterator.vercel.app/?text=${timkiem}`);
    const userName = res.data.baybay;
    
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        return api.sendMessage(`${userName}`, event.threadID, event.messageID);
    }
};
