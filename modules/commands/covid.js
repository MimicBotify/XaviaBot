const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "covid",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "update for covid",
    commandCategory: "news",
    usages: `Search cannot be left blank\n\nHow to use?\n${global.config.PREFIX}covid <country>\n\nExample:\n${global.config.PREFIX}covid japan\n`,
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        var tip = args.join(" ");
        if (!tip) {
            return api.sendMessage(`Search cannot be left blank\n\nHow to use?\n${global.config.PREFIX}covid <country>\n\nExample:\n${global.config.PREFIX}covid japan\n\nCreated by ☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆`, event.threadID, event.messageID);
        } else {
            axios.get(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(tip)}`).then(res => {
                let nhiem = res.data.cases,
                    chet = res.data.deaths,
                    dieutri = res.data.recovered,
                    danso = res.data.population,
                    chauluc = res.data.continent,
                    quocgia = res.data.country;
                var flag = res.data.countryInfo.flag;
                let callback = function() {
                    api.sendMessage({
                        body: `𝗖𝗼𝘂𝗻𝘁𝗿𝘆: ${quocgia}\n\n𝗜𝗻𝗳𝗲𝗰𝘁𝗶𝗼𝗻: ${nhiem}\n𝗗𝗲𝗮𝘁𝗵: ${chet} \n𝗧𝗿𝗲𝗮𝘁𝗺𝗲𝗻𝘁: ${dieutri}\n𝗣𝗼𝗽𝘂𝗹𝗮𝘁𝗶𝗼𝗻: ${danso}\n𝗖𝗼𝗻𝘁𝗶𝗻𝗲𝗻𝘁: ${chauluc}`,
                        attachment: fs.createReadStream(__dirname + `/cache/covidtk.png`)
                    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/covidtk.png`), event.messageID);
                };
                request(encodeURI(flag)).pipe(fs.createWriteStream(__dirname + `/cache/covidtk.png`)).on("close", callback);
            });
        }
    }
};
