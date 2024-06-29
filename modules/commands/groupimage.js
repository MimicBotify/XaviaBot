const fs = require('fs');
const axios = require('axios');

module.exports.config = {
  name: "groupimage",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "Change your group image",
  commandCategory: "Box",
  usages: "groupimage",
  cooldowns: 0,
  dependencies: []
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
  const isActivated = activatedTokens.some(token => token.threadID === threadID);

  if (!isActivated) {
    return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
  } else {
    if (event.type !== "message_reply") {
      return api.sendMessage("❌ You have to reply to a photo", event.threadID, event.messageID);
    }
    if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) {
      return api.sendMessage("❌ You have to reply to a photo", event.threadID, event.messageID);
    }
    if (event.messageReply.attachments.length > 1) {
      return api.sendMessage(`Please reply only 1 photo!`, event.threadID, event.messageID);
    }
    const imageAttachment = event.messageReply.attachments[0].url;
    const pathImg = __dirname + '/cache/loz.png';
    const imageData = (await axios.get(imageAttachment, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathImg, Buffer.from(imageData, 'utf-8'));
    return api.changeGroupImage(fs.createReadStream(pathImg), event.threadID, () => fs.unlinkSync(pathImg), messageID);
  }
  // Other command logic goes here if needed
};
