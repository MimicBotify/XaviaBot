const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
    name: "osu",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "get osu info",
    commandCategory: "Edit-img",
    usages: `Missing username\n\nHow to use?\n${global.config.PREFIX}osu <username>\n\nExample:\n${global.config.PREFIX}osu izumi\n`,
    cooldowns: 5,
    dependencies: {
        "request": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "missingUsername": `Missing username\n\nHow to use?\n${global.config.PREFIX}osu <username>\n\nExample:\n${global.config.PREFIX}osu izumi\n\nCreated by: ZiaRein`
    }
};

module.exports.run = async function ({ api, event, args, getText }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (args.length === 0) return api.sendMessage(getText("missingUsername"), event.threadID, event.messageID);

        request(`http://lemmmy.pw/osusig/sig.php?colour=hex8866ee&uname=${args.join(" ")}&pp=1&countryrank&rankedscore&onlineindicator=undefined&xpbar&xpbarhex`)
            .pipe(fs.createWriteStream(__dirname + `/cache/${event.senderID}-osu.png`))
            .on("close", () => {
                api.sendMessage({ attachment: fs.createReadStream(__dirname + `/cache/${event.senderID}-osu.png`) }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${event.senderID}-osu.png`), event.messageID);
            });
    }
    //other command logic goes here
};
