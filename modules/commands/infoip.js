const fs = require('fs');
const axios = require('axios');

module.exports.config = {
  name: "infoip",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "get info of ip address",
  usages: "[ip address]",
  commandCategory: "...",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
  const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

  if (!isActivated) {
    return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
  } else {
    const juswa = args.join(" ");
    try {
      const res = await axios.get(`https://ostch.herokuapp.com/api/v1/iplookup?q=${juswa}`);
      const { ip, country, region, city, latitude, longitude, maps } = res.data;
      const message = `IP: ${ip}\nCountry: ${country}\nCity: ${city}\nRegion: ${region}\nLatitude: ${latitude}\nLongitude: ${longitude}\nGoogle Map: ${maps}`;
      return api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error fetching IP information:", error);
      return api.sendMessage("An error occurred while fetching IP information.", event.threadID, event.messageID);
    }
  }
};
