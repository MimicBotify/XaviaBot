module.exports.config = {
    name: "logout",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Logout ACC Bot",
    commandCategory: "System",
    usages: "",
    cooldowns: 0
};

module.exports.run = async function({ api, event })
const permission = [`100039556069166`];
	if (!permission.includes(event.senderID)) return api.sendMessage("You don't have permission to use this command.\nOnly ☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆", event.threadID, event.messageID);
{
api.sendMessage("Logout ...",event.threadID,event.messageID)
api.logout()
}