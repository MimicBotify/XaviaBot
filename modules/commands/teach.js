const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "teach",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Teach SimSimi",
    usages: "[hi => hello]",
    commandCategory: "...",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
    } else {
        let text = args.join(" ");
        const text1 = text.substr(0, text.indexOf(' => '));
        const text2 = text.split(" => ").pop();

        const res = await axios.get(`https://api.phamvandien.xyz/sim?type=teach&ask=${encodeURIComponent(text1)}&ans=${encodeURIComponent(text2)}`);
        const ask = res.data.data.ask;
        const ans = res.data.data.ans;

        return api.sendMessage(`Your ask: ${ask}\nSimSimi's response: ${ans}`, event.threadID, event.messageID);
    }
}
