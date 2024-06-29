const fs = require('fs');
const axios = require('axios');

module.exports.config = {
  name: "groupemoji",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "Change your group Emoji",
  commandCategory: "Box",
  usages: "groupemoji [name]",
  cooldowns: 0,
  dependencies: []
};

module.exports.run = async function ({ api, event, args }) {
  const emoji = args.join(" ");
  const { threadID, messageID } = event;

  if (!emoji) {
    api.sendMessage("You have not entered Emoji 💩💩", threadID, messageID);
  } else {
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
      return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
      api.changeThreadEmoji(emoji, threadID, () => api.sendMessage(`🔨 The bot successfully changed Emoji to: ${emoji}`, threadID, messageID));
    }
  }
  // Other command logic goes here if needed
};
