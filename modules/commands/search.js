const fs = require('fs');
const axios = require('axios');
const google = require('googlethis');

//module export goes here
module.exports.config = {
    name: "search",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "web search",
    usages: `Search cannot be left blank\n\nHow to use?\n${global.config.PREFIX}search <text>\n\nExample:\n${global.config.PREFIX}search magnetic reversal\n`,
    commandCategory: "google",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    }

    const searchText = args.join(" ");

    if (!searchText) {
        return api.sendMessage(`Search cannot be left blank\n\nHow to use?\n${global.config.PREFIX}search <text>\n\nExample:\n${global.config.PREFIX}search magnetic reversal\n\nCreated by: ☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆`, threadID, messageID);
    }

    try {
        const searchResults = await google.search(`${searchText}`, {
            page: 0,
            safe: false,
            parse_ads: false,
            additional_params: {
                hl: 'en'
            }
        });

        if (searchResults.results && searchResults.results.length > 0) {
            const firstResult = searchResults.results[0];
            const description = firstResult.description;
            api.sendMessage(description, threadID, messageID);
        } else {
            api.sendMessage("No search results found.", threadID, messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching search results.", threadID, messageID);
    }
    // other command logic goes here
};
