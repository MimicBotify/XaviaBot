const fs = require('fs');
const axios = require('axios');
const wiki = global.nodemodule["wikijs"].default;

module.exports.config = {
    name: "wiki",
    version: "1.0.1",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Wikipedia search",
    commandCategory: "study",
    usages: "[en] [search information]",
    cooldowns: 1,
    dependencies: {
        "wikijs": ""
    }
}

module.exports.languages = {
    "en": {
        "missingInput": `Enter what you need to search\n\nHow to use?\n${global.config.PREFIX}wiki <search>\n\nExample:\n${global.config.PREFIX}wiki japan\n\nCreated by: ZiaRein`,
        "returnNotFound": "Can't find %1"
        // Add translations for other languages if needed
    }
}

module.exports.run = async function ({ api, event, args, getText }) {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let url = 'https://en.wikipedia.org/w/api.php';
        let content = args.join(" ");

        if (args[0] === "en") {
            url = 'https://en.wikipedia.org/w/api.php';
            content = args.slice(1).join(" ");
        }

        if (!content) {
            return api.sendMessage(getText("missingInput"), threadID, messageID);
        }

        try {
            const page = await wiki({ apiUrl: url }).page(content);
            if (typeof page !== 'undefined') {
                const summary = await page.summary();
                return api.sendMessage(summary, threadID, messageID);
            } else {
                return api.sendMessage(getText("returnNotFound", content), threadID, messageID);
            }
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while fetching the Wikipedia information.", threadID, messageID);
        }
    }
    // Other command logic goes here
}
