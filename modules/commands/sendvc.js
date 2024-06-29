const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "sendvc",
    version: "2.0.8",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Sends verification code on ML",
    commandCategory: "utilities",
    usages: "sendvc [gamerid]",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
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
        let gameid = args.join(" ");
        if (!gameid) {
            api.sendMessage("❌Invalid Use Of Command!\n💡Usage: !sendvc id", event.threadID);
        } else {
            try {
                async function sendvc(gameid) {
                    try {
                        const response = await axios.get('https://api.mobilelegends.com/mlweb/sendMail?roleId=' + gameid.toString() + '&language=en');
                        const msgs = {
                            "9601": "Error sending and receiving vcode",
                            "-20023": "Invalid Game ID",
                            "-20027": "Request too Frequent!...",
                            "-20028": "Verification code already sent...",
                            // Add more messages based on response codes as needed
                        };
                        let resp = response.data.code.toString();
                        let msg = msgs[resp] || "Unknown error";
                        let stat = response.data.status;
                        api.sendMessage(`💠Kaiden Sender Code\n\n🆔Game Id: ${gameid}\n🔰Status: ${stat}\n📧Message: ${msg}`, event.threadID, event.messageID);
                    } catch (error) {
                        console.log("ERR: " + error);
                    }
                }
                api.sendMessage(`📤Sending Verification Code...(${args[0]})`, event.threadID, event.messageID);
                sendvc(args[0]);
            } catch (err) {
                api.sendMessage("❌Error: " + err.message, event.threadID, event.messageID);
            }
        }
    }
    // Other command logic goes here
};
