const axios = require("axios");

module.exports.config = {
  name: "sim",
  version: "1",
  hasPermission: 0,
  credits: "Jonell Magallanes",
  description: "Chat with Simini",
  usages: "sim [yor message]",
  commandCategory: "Fun",
  cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
  try {
    let message = args.join(" ");
    if (!message) {
      return api.sendMessage(`📝  | Please put message`, event.threadID, event.messageID);
    }

    const response = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=ph&message=${message}&filter=false`);
    const respond = response.data.respond;
    api.sendMessage(respond, event.threadID, event.messageID);
  } catch (error) {
    console.error("An error occurred:", error);
    api.sendMessage("Oops! Something went wrong.", event.threadID, event.messageID);
  }
};