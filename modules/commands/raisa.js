const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "raisa",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Tanvir",
    description: "Chat with bot",
    commandCategory: "entertainment",
    usages: "kemon aso",
    cooldowns: 2,
    dependencies: {
        fs: "",
        path: "",
        axios: ""
    }
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const input = args.join(" ").toLowerCase();

        // Resolve the file path
        const filePath = path.resolve(__dirname, 'memory.json');

        // Read the JSON file
        fs.readFile(filePath, 'utf8', (err, jsonString) => {
            if (err) {
                console.log("Error reading file from disk:", err);
                return api.sendMessage("Error reading file from memory.", threadID, messageID);
            }

            try {
                const json = JSON.parse(jsonString);
                const output = json[input];

                if (output) {
                    return api.sendMessage(output, threadID, messageID);
                } else {
                    return api.sendMessage("I don't know the answer for that question.", threadID, messageID);
                }
            } catch (err) {
                console.log('Error parsing JSON string:', err);
                return api.sendMessage("Error parsing JSON string.", threadID, messageID);
            }
        });
    }
}