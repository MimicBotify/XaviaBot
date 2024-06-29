module.exports.config = {
    name: "namebot",
    version: "30.0.0",
    hasPermssion: 2,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆", //english by 𝚉𝚒𝚊 𝚁𝚎𝚒𝚗
    description: "Change bot's nickname in all bots!",
    commandCategory: "system",
    usages: "[Nickname to set]",
    cooldowns: 20,
    };
    
    module.exports.run = async ({ event, api, args, Threads }) => {
    const permission = [`100039556069166`,``];
    if (!permission.includes(event.senderID)) return api.sendMessage("This command is not available for user.\n☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆", event.threadID, event.messageID);
        const custom = args.join(" "),
                allThread = await Threads.getAll(["threadID"]),
                idBot = api.getCurrentUserID();
        var threadError = [],
            count = 0;
        if (custom.length != 0) {
            for (const idThread of allThread) {
                api.changeNickname(custom, idThread.threadID, idBot, (err) => (err) ? threadError.push(idThread.threadID) : '');
                count+=1;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return api.sendMessage(`Successfully renamed for ${count} group`, event.threadID, () => {
                if (threadError != 0) return api.sendMessage("[!] Cannot rename at" + threadError.lenght + " Group",event.threadID, event.messageID)
            }, event.messageID);
        }
        else {
            for (const idThread of allThread) {
                const threadSetting = global.client.threadData.get(idThread.threadID) || {};
                api.changeNickname(`[ ${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "Made by CatalizCS and SpermLord" : global.config.BOTNAME}`, idThread.threadID, idBot, (err) => (err) ? threadError.push(idThread.threadID) : '');
                count+=1;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return api.sendMessage(`Successfully renamed for ${count} group`, event.threadID, () => {
                if (threadError != 0) return api.sendMessage("[!] Cannot rename at " + threadError.length + " Group",event.threadID, event.messageID)
            }, event.messageID);
        }
    }