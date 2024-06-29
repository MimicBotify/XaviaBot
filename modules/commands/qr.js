const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "qr",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Encrypt text with QR code",
    commandCategory: "Tool",
    usages: "[text]",
    cooldowns: 5,
    dependencies: {
        "qrcode": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "vi": {
        "missingInput": "Hãy nhập đầu vào để có thể tạo qr code"
    },
    "en": {
        "missingInput": "Enter input to create qr code"
    }
}

module.exports.run = async function ({ api, event, args, getText }) {
    const { createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
    const text = args.join(" ");

    const { threadID, messageID } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (!text) return api.sendMessage(getText("missingInput"), event.threadID);

        var opt = {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.3,
            scale: 50,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' }
        };

        api.sendTypingIndicator(event.threadID, () => global.nodemodule["qrcode"].toFile(__dirname + '/cache/qr.png', text, opt, (err) => {
            if (err) return err;
            api.sendMessage({
                attachment: createReadStream(__dirname + '/cache/qr.png')
            }, event.threadID, () => unlinkSync(__dirname + '/cache/qr.png'), event.messageID);
        }));
    }
    // Other command logic goes here
};
