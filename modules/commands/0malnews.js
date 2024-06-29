const malScraper = require('mal-scraper');
const fs = require('fs');

module.exports.config = {
    name: "malnews",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "lastest aninews",
    commandCategory: "anime",
    usages: " ",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const nbNews = 5;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        malScraper.getNewsNoDetails(nbNews)
            .then((news) => {
                const newsTitles = news.map((item, index) => `【 ${index + 1} 】${item.title}`).join("\n\n");
                const message = `Top ${nbNews} latest my anime list news:\n\n${newsTitles}`;
                return api.sendMessage(message, threadID, messageID);
            })
            .catch((err) => {
                console.error(err);
                return api.sendMessage("An error occurred while fetching anime news.", threadID, messageID);
            });
    }
};
