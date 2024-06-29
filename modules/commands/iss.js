const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
  name: "iss",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "See the coordinates that the spacecraft is in Lac",
  commandCategory: "Tool",
  usages: "iss",
  cooldowns: 5,
  dependencies: {
    "request": ""
  }
};

module.exports.run = function({ api, event }) {
  const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
  const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

  if (!isActivated) {
    return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
  } else {
    return request(`http://api.open-notify.org/iss-now.json`, (err, response, body) => {
      if (err) throw err;
      const jsonData = JSON.parse(body);
      api.sendMessage(`Current location of International Space Station 🌌🌠🌃 \n- Latitude: ${jsonData.iss_position.latitude}\n- Longitude: ${jsonData.iss_position.longitude}`, event.threadID, event.messageID);
    });
  }
};
