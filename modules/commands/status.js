const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "status",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "log",
    commandCategory: "System",
    usages: "",
    cooldowns: 3,
    dependencies: {}
};

module.exports.run = async function ({ api, event, Threads, getText }) {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));

    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const dataThread = await Threads.getData(threadID);
        const data = dataThread.data;

        const log = data.log ?? 'true';
        const rankup = data.rankup ?? 'false';
        const resend = data.resend ?? 'false';
        const tagadmin = data.tagadmin ?? 'true';
        const guard = data.guard ?? 'true';
        const antiout = data.antiout ?? 'true';

        const message = `ᅠᅠ☣️Table ☣️ \n\n\n🍄────•🦋• ────🍄\n❯ 🍉 Log: ${log}\n❯ 🍇 Rankup: ${rankup}\n❯ 🍓 Resend: ${resend}\n❯ 🥕 Tag admin: ${tagadmin}\n❯ 🍑 Antirobbery ${guard}\n❯ 🍒 Antiout: ${antiout}\n🍄────•🦋• ────🍄`;

        return api.sendMessage(message, threadID, messageID);
    }
    // other command logic goes here if needed
};
