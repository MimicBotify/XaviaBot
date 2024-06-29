const fs = require('fs');
const axios = require('axios');

// module export goes here

module.exports.config = {
    name: "image",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Search an Image",
    commandCategory: "image",
    usages: "imagesearch [text]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "googlethis": "",
        "cloudscraper": ""
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
        try {
            var query = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
            api.sendMessage(`🔍𝘀𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿\n【 ${query} 】`, event.threadID, event.messageID);

            let result = await global.nodemodule["googlethis"].image(query, { safe: false });
            if (result.length === 0) {
                api.sendMessage(`⚠️𝘆𝗼𝘂𝗿 𝗶𝗺𝗮𝗴𝗲 𝘀𝗲𝗮𝗿𝗰𝗵 𝗱𝗶𝗱 𝗻𝗼𝘁 𝗿𝗲𝘁𝘂𝗿𝗻 𝗮𝗻𝘆 𝗿𝗲𝘀𝘂𝗹𝘁`, event.threadID, event.messageID)
                return;
            }

            let streams = [];
            let counter = 0;

            for (let image of result) {
                if (counter >= 9) break;
                let url = image.url;
                if (!url.endsWith(".jpg") && !url.endsWith(".png")) continue;

                let path = __dirname + `/cache/search-image-${counter}.jpg`;
                let hasError = false;
                await global.nodemodule["cloudscraper"].get({ uri: url, encoding: null })
                    .then((buffer) => fs.writeFileSync(path, buffer))
                    .catch((error) => {
                        console.log(error);
                        hasError = true;
                    });

                if (hasError) continue;

                streams.push(fs.createReadStream(path).on("end", async () => {
                    if (fs.existsSync(path)) {
                        fs.unlink(path, (err) => {
                            if (err) return console.log(err);
                            console.log(`Deleted file: ${path}`);
                        });
                    }
                }));

                counter += 1;
            }

            api.sendMessage("⏳𝘀𝗲𝗻𝗱𝗶𝗻𝗴 𝘀𝗲𝗮𝗿𝗰𝗵 𝗿𝗲𝘀𝘂𝗹𝘁𝘀 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁", event.threadID, event.messageID)

            let msg = {
                body: `𝗶𝗺𝗮𝗴𝗲 𝘀𝗲𝗮𝗿𝗰𝗵 𝗿𝗲𝘀𝘂𝗹𝘁𝘀 𝗳𝗼𝗿\n【 ${query} 】`,
                attachment: streams
            };

            api.sendMessage(msg, event.threadID, event.messageID);
        } catch (e) {
            console.log("ERR: " + e);
            api.sendMessage("⚠️ERR: " + e, event.threadID, event.messageID);
        }
    }
}
