const fs = global.nodemodule["fs-extra"];
const request = global.nodemodule["request"];

module.exports.config = {
    name: "adbot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "",
    commandCategory: "Media",
    usages: "",
    cooldowns: 4,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let targetUserID;

        if (args[0] === "user") {
            if (event.type === "message_reply") targetUserID = event.messageReply.senderID;
            else if (args[1] && args[1].indexOf('@') !== -1) {
                const mentionIDs = Object.keys(mentions);
                if (mentionIDs.length > 0) targetUserID = mentionIDs[0];
            } else if (args[1]) {
                targetUserID = args[1];
            }
        }

        if (!targetUserID) {
            return api.sendMessage("Invalid command usage.", threadID, messageID);
        }

        try {
            const userData = await api.getUserInfo(targetUserID);

            if (!userData[targetUserID]) {
                return api.sendMessage("User data not found.", threadID, messageID);
            }

            const { profileUrl, isFriend, vanity, name, gender } = userData[targetUserID];
            const userGender = gender === 2 ? "Male" : gender === 1 ? "Female" : "Unknown";

            const message = `Name: ${name}\nPersonal URL: ${profileUrl}\nUser name: ${vanity}\nUID: ${targetUserID}\nGender: ${userGender}\nMake friends with bots: ${isFriend ? 'Yes!' : 'No.'}`;

            const pictureURL = `https://graph.facebook.com/${targetUserID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const filePath = __dirname + `/cache/${targetUserID}.png`;

            const callback = () => {
                api.sendMessage({
                    body: message,
                    attachment: fs.createReadStream(filePath)
                }, threadID, () => fs.unlinkSync(filePath));
            };

            request(encodeURI(pictureURL))
                .pipe(fs.createWriteStream(filePath))
                .on('close', () => callback());
        } catch (error) {
            console.error('Error occurred:', error);
            api.sendMessage("An error occurred while processing your request.", threadID, messageID);
        }
    }
};
