const fs = require('fs');
const axios = require('axios');

module.exports.config = {
  name: "ip",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "View your IP information or other IP",
  commandCategory: "other",
  usages: "",
  cooldowns: 5,
  dependencies: "",
};

module.exports.run = async function ({ api, args, event, __GLOBAL }) {
  const timeStart = Date.now();
  const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
  const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

  if (!isActivated) {
    return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
  } else {
    if (!args[0]) {
      return api.sendMessage("Please enter the IP you want to check", event.threadID, event.messageID);
    } else {
      try {
        const infoip = (await axios.get(`http://ip-api.com/json/${args.join(' ')}?fields=66846719`)).data;

        if (infoip.status === 'fail') {
          return api.sendMessage(`Error! An error occurred. Please try again later: ${infoip.message}`, event.threadID, event.messageID);
        } else {
          const ipInfo = `======${Date.now() - timeStart}ms=====
🗺️ Continent: ${infoip.continent}
🏳️ Nation: ${infoip.country}
🎊 Country Code: ${infoip.countryCode}
🕋 Area: ${infoip.region}
⛱️ Region/State: ${infoip.regionName}
🏙️ City: ${infoip.city}
🛣️ District: ${infoip.district}
📮 ZIP code: ${infoip.zip}
🧭 Latitude: ${infoip.lat}
🧭 Longitude: ${infoip.lon}
⏱️ Timezone: ${infoip.timezone}
👨‍✈️ Organization Name: ${infoip.org}
💵 Currency unit: ${infoip.currency}`;

          return api.sendMessage({
            body: ipInfo,
            location: {
              latitude: infoip.lat,
              longitude: infoip.lon,
              current: true
            }
          }, event.threadID, event.messageID);
        }
      } catch (error) {
        console.error("Error fetching IP information:", error);
        return api.sendMessage("An error occurred while fetching IP information. Please try again later.", event.threadID, event.messageID);
      }
    }
  }
};
