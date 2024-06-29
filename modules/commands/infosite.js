const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
  name: "siteinf",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "View site info",
  commandCategory: "info",
  usages: "[site]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
  const isActivated = activatedTokens.some(token => token.threadID === event.threadID);

  if (!isActivated) {
    return api.sendMessage("Group is not activated. Please activate the group to use the command.", event.threadID, event.messageID);
  } else {
    const juswa = args.join(" ");
    if (!juswa) return api.sendMessage(`Please add a URL of the site.`, event.threadID, event.messageID);
    else {
      try {
        const res = await axios.get(`https://list.ly/api/v4/meta?url=${encodeURIComponent(juswa)}`);
        const { name, description, url, image } = res.data;

        const callback = () => {
          api.sendMessage(
            {
              body: `Name: ${name}\n\nDescription: ${description}\n\nUrl: ${url}`,
              attachment: fs.createReadStream(__dirname + `/cache/juswa.png`)
            },
            event.threadID,
            () => fs.unlinkSync(__dirname + `/cache/juswa.png`),
            event.messageID
          );
        };

        request(encodeURI(image)).pipe(fs.createWriteStream(__dirname + `/cache/juswa.png`)).on("close", callback);
      } catch (error) {
        console.error("Error fetching site information:", error);
        return api.sendMessage("An error occurred while fetching site information.", event.threadID, event.messageID);
      }
    }
  }
};
