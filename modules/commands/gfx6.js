const fs = require('fs');
const axios = require('axios');

var dek = "Deku";

module.exports.config = {
  name: "gfx6",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "gfx banner",
  commandCategory: "banner",
  usages: "text",
  cooldowns: 2,
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { senderID, threadID, messageID } = event;
  const fs = require("fs-extra");
  const axios = require("axios");

  const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
  const isActivated = activatedTokens.some(token => token.threadID === threadID);

  if (!isActivated) {
    return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
  } else {
    let pathImg = __dirname + `/cache/${event.threadID}_${event.senderID}.png`;
    let text = args.join(" ");
    if (!text) return api.sendMessage(`Wrong format\nUse: ${global.config.PREFIX}${this.config.name} text`, event.threadID, event.messageID);
    let getWanted = (
      await axios.get(`https://api.harold0810.repl.co/canvas/gura?text=${text}`, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));
    return api.sendMessage(
      { attachment: fs.createReadStream(pathImg) },
      threadID,
      () => fs.unlinkSync(pathImg),
      messageID
    );
  }
  // Other command logic goes here if needed
};
