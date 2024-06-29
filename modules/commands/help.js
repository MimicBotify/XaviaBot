const fs = require('fs');
const axios = require('axios');

module.exports.config = {
	name: "help",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
	description: "Beginner's Guide",
	commandCategory: "system",
	usages: "[Tên module]",
	cooldowns: 1,
	envConfig: {
		autoUnsend: true,
		delayUnsend: 300
	}
};

module.exports.languages = {
	//"vi": {
	//	"moduleInfo": "「 %1 」\n%2\n\n❯ Cách sử dụng: %3\n❯ Thuộc nhóm: %4\n❯ Thời gian chờ: %5 giây(s)\n❯ Quyền hạn: %6\n\n» Module code by %7 «",
	//	"helpList": '[ Hiện tại đang có %1 lệnh có thể sử dụng trên bot này, Sử dụng: "%2help nameCommand" để xem chi tiết cách sử dụng! ]"',
	//	"user": "Người dùng",
  //      "adminGroup": "Quản trị viên nhóm",
  //      "adminBot": "Quản trị viên bot"
//	},
	"en": {
		"moduleInfo": " ◤ %1 ◥\n%2\n\n●𝗨𝘀𝗮𝗴𝗲: %3\n●𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %4\n●𝗪𝗮𝗶𝘁𝗶𝗻𝗴 𝘁𝗶𝗺𝗲: %5 seconds(s)\n●𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %6\n\n►𝗠𝗼𝗱𝘂𝗹𝗲 𝗰𝗼𝗱𝗲 𝗯𝘆 ☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆ ",
		"helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
		"user": "User",
        "adminGroup": "Admin group",
        "adminBot": "Admin bot"
	}
};

module.exports.handleEvent = function ({ api, event, getText }) {
	const { commands } = global.client;
	const { threadID, messageID, body } = event;

	if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
	const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
	if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const command = commands.get(splitBody[1].toLowerCase());
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
	return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports.run = async function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const command = commands.get((args[0] || "").toLowerCase());
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (!command) {
            const arrayInfo = Array.from(commands.keys());
            const page = parseInt(args[0]) || 1;
            const numberOfOnePage = 20;

            const startSlice = numberOfOnePage * page - numberOfOnePage;
            const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);
            let msg = "";

            returnArray.forEach((cmd, index) => {
                msg += `『${startSlice + index + 1}』 ${prefix}${cmd}\n`;
            });

            const siu = `╭──────────╮\n𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 𝐋𝐈𝐒𝐓\n╰──────────╯`;
            const text = `\n╭──────╮\n ✅𝐏𝐀𝐆𝐄✅\n╰──────╯ (${page}/${Math.ceil(arrayInfo.length/numberOfOnePage)})\n𝗨𝘀𝗲${prefix}help To See More 🌷𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗻𝗮𝗺𝗲🌷more details about that command\n\nCurrently available ${arrayInfo.length} command on ${global.config.BOTNAME} Bot\n\n╭────────╮\n𝗡𝗔𝗠𝗘 𝗢𝗪𝗡𝗘𝗥 \n╰────────╯\n${prefix}\n╭────────────────╮\n☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆\n╰────────────────╯
           💞𝗕𝗼𝘁 𝗖𝗼𝗺𝗺𝘂𝗻𝗶𝘁𝘆 𝗛𝗲𝗹𝗽𝗶𝗻𝗴 𝗭𝗼𝗻𝗲💞\n
           [✅𝐅𝐀𝐂𝐄𝐁𝐎𝐎K✅]\n
           https://www.facebook.com/profile.php?id=61555671747709🥀🥀\n╭────────────────╮\n☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆\n╰────────────────╯
                 ✌😎`;
            
               return api.sendMessage(siu + "\n\n" + msg  + text, threadID, async (error, info) => {
                       if (autoUnsend) {
                           await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
                           return api.unsendMessage(info.messageID);
                       } else return;
                   }, event.messageID);
               

            return;
        }

        return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
    }
};
