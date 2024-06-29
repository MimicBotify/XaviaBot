const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

module.exports.config = {
    name: "news",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "",
    commandCategory: "news",
    usages: "[key word]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "cheerio": "",
        "https": ""
    }
};

module.exports.languages = {
    "en": {
        "MissingInput": "Enter what you want to search ",
        "notFoundResult": "There is no result match your input"
    }
};

module.exports.run = async function({ api, event, args, getText }) {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const out = (msg) => api.sendMessage(msg, threadID, messageID);
        const url = "https://timkiem.vnexpress.net/?q=";
        const q = args.join(" ");
        if (!q) return out(getText("MissingInput"));

        try {
            const data = await axios.get(url + encodeURIComponent(q));
            const $ = cheerio.load(data.data);

            if (!$('h3.title-news').eq(0).text()) return out(getText("notFoundResult"));

            for (let e = 0; e < 3; e++) {
                const title = $('h3.title-news').eq(e).text().replace(/\n|\t/g, "");
                const desc = $('p.description').eq(e).text();
                const link = $('h3.title-news a').eq(e).attr('href');
                out(`${title}\n\n${desc}\n${link}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error(error);
            return out("An error occurred while fetching data.");
        }
    }
};
