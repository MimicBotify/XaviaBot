const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "avatar",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "",
    commandCategory: "image",
    usages: "{p}{n} <character code or character name> | <background letters> | <signature> | <English color name or background color code (hex color)>\n{p}{n} ",
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
        if (!args[0]) {
            api.sendMessage(`Please enter something or use "${global.config.PREFIX}help avatar" for more info`, threadID, messageID);
        } else {
            api.sendMessage(`Image initialization, please wait...`, threadID, messageID);
            const content = args.join(" ").split("|").map(item => item.trim());
            let idNhanVat, tenNhanvat;
            const chu_Nen = content[1];
            const chu_Ky = content[2];
            const colorBg = content[3];

            try {
                const dataChracter = (await axios.get("https://goatbot.tk/taoanhdep/listavataranime?apikey=ntkhang")).data.data;
                if (!isNaN(content[0])) {
                    idNhanVat = parseInt(content[0]);
                    const totalCharacter = dataChracter.length - 1;
                    if (idNhanVat > totalCharacter) return api.sendMessage(`Currently only ${totalCharacter} character on the system, please enter a smaller character id`, threadID, messageID);
                    tenNhanvat = dataChracter[idNhanVat].name;
                } else {
                    const findChracter = dataChracter.find(item => item.name.toLowerCase() === content[0].toLowerCase());
                    if (findChracter) {
                        idNhanVat = findChracter.stt;
                        tenNhanvat = content[0];
                    } else {
                        return api.sendMessage(`The character named "${content[0]}" could not be found in the character list`, threadID, messageID);
                    }
                }
            } catch (error) {
                const err = error.response.data;
                return api.sendMessage(`An error occurred while getting character data:\n${err.name}: ${err.message}`, threadID, messageID);
            }

            const endpoint = `https://goatbot.tk/taoanhdep/avataranime`;
            const params = {
                id: idNhanVat,
                chu_Nen,
                chu_Ky,
                apikey: "ntkhangGoatBot"
            };
            if (colorBg) params.colorBg = colorBg;

            try {
                const response = await axios.get(endpoint, {
                    params,
                    responseType: "stream"
                });
                api.sendMessage({
                    body: `✅ Your avatar\nCharacter: ${tenNhanvat}\nCode: ${idNhanVat}\nText background: ${chu_Nen}\nSignature: ${chu_Ky}\nColor: ${colorBg || "default"}`,
                    attachment: response.data
                }, threadID, messageID);
            } catch (error) {
                api.sendMessage(`Error! An error occurred. Please try again later`, threadID, messageID);
            }
        }
    }
};
