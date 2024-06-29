const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "dictionary",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Look up the dictionary",
    usage: `Missing input\n\nHow to use?\n${global.config.PREFIX}dictionary <input>\n\nExample:\n${global.config.PREFIX}dictionary aesthetic\n`,
    commandCategory: "study",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (args[0]) {
            try {
                const res = await axios.get(encodeURI(`https://api.dictionaryapi.dev/api/v2/entries/en/${args.join(" ").trim().toLowerCase()}`));
                const data = res.data[0];
                const phonetics = data.phonetics;
                const meanings = data.meanings;

                let msgPhonetics = phonetics.map(item => item.text ? `\n    /${item.text}/` : '').join('');

                let msgMeanings = meanings.map(item => {
                    let example = item.definitions[0].example ? `\n*example:\n "${item.definitions[0].example[0].toUpperCase() + item.definitions[0].example.slice(1)}"` : '';
                    return `\n• ${item.partOfSpeech}\n ${item.definitions[0].definition[0].toUpperCase() + item.definitions[0].definition.slice(1) + example}`;
                }).join('');

                const msg = `❰ ❝ ${data.word} ❞ ❱${msgPhonetics}${msgMeanings}`;

                return api.sendMessage(msg, threadID, messageID);
            } catch (err) {
                if (err.response.status === 404) {
                    return api.sendMessage('No Definitions Found', threadID, messageID);
                }
            }
        } else {
            return api.sendMessage(`Missing input\n\nHow to use?\n${global.config.PREFIX}dictionary <input>\n\nExample:\n${global.config.PREFIX}dictionary aesthetic\n\nCreated by: LaFhanGa chokra`, threadID, messageID);
        }
    }
    //other command logic goes here
};
