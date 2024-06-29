module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "CatalizCS",
    description: "Notification of bots or people entering groups with random gif/photo/video",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};
 
module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
 
    const path = join(__dirname, "cache", "joinGif");
    if (existsSync(path)) mkdirSync(path, { recursive: true }); 
 
    const path2 = join(__dirname, "cache", "joinGif", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });
 
    return;
}
 
 
module.exports.run = async function({ api, event }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " " : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
        const fs = require("fs");
        return api.sendMessage("", event.threadID, () => api.sendMessage({body: `${global.config.BOTNAME} 𝔹𝕠𝕥 ℂ𝕠𝕟𝕟𝕖𝕔𝕥𝕖𝕕 ✅\n
╭────────────╮\n
🌻Total Users: ${global.data.allUserID.length}🌻\n
╰────────────╯\n
─────────────────\n
Assalamu Alaikum\n
─────────────────\n
My Name Is ${global.config.BOTNAME}\n
─────────────────\n
My Prefix Is [ ${global.config.PREFIX} ]\n
─────────────────\n
Type ${global.config.PREFIX}help2 to see my cmd list.
\n
─────────────────\n
My Owner Is Botify\n
─────────────────\n
Use ${global.config.PREFIX}raisa to talk to the bot.\n
🌷::𝐄𝐱𝐚𝐦𝐩𝐥𝐞::🌷\n
${global.config.PREFIX}raisa kemon aso
─────────────────\n
But to use the available command, you have to activate the current group first.
Contact our page to activate this group.\n
Facebook Page:\n
https://www.facebook.com/profile.php?id=61555671747709`, attachment: fs.createReadStream(__dirname + "/cache/joinGif/welc.gif")} ,threadID));
    }
    else {
        try {
            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
 
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const path = join(__dirname, "cache", "joinGif");
            const pathGif = join(path, `${threadID}.gif`);
 
            var mentions = [], nameArray = [], memLength = [], i = 0;
            
            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }
            memLength.sort((a, b) => a - b);
            
            (typeof threadData.customJoin == "undefined") ? msg = "𝕳𝖊𝖑𝖑𝖔 𝕄𝕣 {name},\n─────────────────\nY𝖔𝖚'𝖗𝖊 T𝖍𝖊 {soThanhVien}M𝖊𝖒𝖇𝖊𝖗 ─────────────────\n𝕆𝖋 {threadName} G𝖗𝖔𝖚𝖕\n─────────────────\nP𝖑𝖊𝖆𝖘𝖊 𝕰𝖓𝖏𝖔𝖞 Y𝖔𝖚𝖗 S𝖙𝖆𝖞\n─────────────────\nA𝖓𝖉 M𝖆𝖐𝖊 𝕷𝖔𝖙𝖘 𝕺𝖋 F𝖗𝖎𝖊𝖓𝖉𝖘🥳😍 " : msg = threadData.customJoin;
            msg = msg
            .replace(/\{name}/g, nameArray.join(', '))
            .replace(/\{type}/g, (memLength.length > 1) ?  'Friends' : 'Friend')
            .replace(/\{soThanhVien}/g, memLength.join(', '))
            .replace(/\{threadName}/g, threadName);
 
            if (existsSync(path)) mkdirSync(path, { recursive: true });
 
            const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));
 
            if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
            else if (randomPath.length != 0) {
                const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
            }
            else formPush = { body: msg, mentions }
 
            return api.sendMessage(formPush, threadID);
        } catch (e) { return console.log(e) };
    }
      }