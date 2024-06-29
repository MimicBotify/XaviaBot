const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');

module.exports.config = {
    name: "animescrape",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆  ",
    description: "scrape anime",
    commandCategory: "anime",
    usages: "<space>AnimeTitle",
    cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const text = args.join(" ");
        const url = `https://nyaa.si/?f=0&c=1_2&q=${text}`;

        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const arrayList = $(".table-responsive table tbody tr");
            const res = [];

            arrayList.each((idx, el) => {
                const Data = {};
                Data.name = $(el).children("td").children("a").text().replace(/\t/gi,"").replace(/\n/gi,"");
                Data.torrentLink = $(el).children(".text-center").children("a")[1].attribs.href;
                res.push(Data);
            });

            const formattedData = res.slice(0, 5).map(({ name, torrentLink }) => `${name}\n\n${torrentLink}\n\n`).join("🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n`);

            fs.writeFile(__dirname + "/cache/torrent-links.txt", formattedData, function(err) {
                if (err) {
                    console.log(err);
                    return api.sendMessage("There was an issue while processing your request.", threadID, messageID);
                }

                console.log("The file was saved!");

                const message = {
                    body: "Scraping Success\nDownload and Check the text file below!\n\nNote: This API can only search for anime series/movies. Inside the text file, there are 5 links that the API scraped.\n\nSource: https://nyaa.si/",
                    attachment: fs.createReadStream(__dirname + "/cache/torrent-links.txt")
                };

                api.sendMessage(message, threadID);
            });
        } catch (error) {
            console.error(error);
            api.sendMessage("There was an issue while processing your request.", threadID, messageID);
        }
    }
};
