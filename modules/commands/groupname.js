const fs = require('fs');
const axios = require('axios');

module.exports.config = {
  name: "groupname",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "Rename your group",
  commandCategory: "Box",
  usages: "groupname [name]",
  cooldowns: 0,
  dependencies: []
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const name = args.join(" ");

  const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
  const isActivated = activatedTokens.some(token => token.threadID === threadID);

  if (!isActivated) {
    return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
  } else {
    if (!name) {
      return api.sendMessage("❌ You have not entered the group name you want to change", event.threadID, event.messageID);
    } else {
      api.setTitle(name, threadID, () => api.sendMessage(`🔨 The bot changed the group name to: ${name}`, threadID, messageID));
    }
  }
  // Other command logic goes here if needed
};
