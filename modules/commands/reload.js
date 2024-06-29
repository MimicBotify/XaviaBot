const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "reload",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Restarts the bot",
    commandCategory: "Penguin",
    usages: "reload + time",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, event.messageID);
    } else {
        const time = args.join(" ");
        const reloadTime = time ? parseInt(time) : 69;

        api.sendMessage(`[Bot] => Will reload the bot in ${reloadTime} seconds!`, threadID);

        setTimeout(() => {
            api.sendMessage("[Bot] => Reloading Bot!", threadID, () => process.exit(1));
        }, reloadTime * 1000);
    }
};
