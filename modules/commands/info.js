const fs = require('fs');
const axios = require('axios');
const moment = require("moment-timezone");

// Module export goes here
module.exports.config = {
    name: "info",
    version: "1.2.6",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "info bot owner",
    commandCategory: "Dành cho người dùng",
    hide: true,
    usages: "",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText, Threads }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const { configPath } = global.client;
        const { ADMINBOT, NDH } = global.config;
        const { userName } = global.data;
        const request = global.nodemodule["request"];
        const { writeFileSync } = global.nodemodule["fs-extra"];
        const mention = Object.keys(mentions);
        delete require.cache[require.resolve(configPath)];
        var config = require(configPath);
        const listAdmin = ADMINBOT || config.ADMINBOT || [];
        const listNDH = NDH || config.NDH || [];
        const PREFIX = config.PREFIX;
        const namebot = config.BOTNAME;
        const { commands } = global.client;
        const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
        const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
        const dateNow = Date.now();
        const time = process.uptime(),
            hours = Math.floor(time / (60 * 60)),
            minutes = Math.floor((time % (60 * 60)) / 60),
            seconds = Math.floor(time % 60);
            const data = [
              "Bạn không thể tìm được lệnh admin tại 'help' của MintBot",
              "Đừng mong chờ gì từ MintBot.",
              "Cái đoạn này á? Của SpermBot.",
              "Nếu muốn không lỗi lệnh thì hãy xài những lệnh có trong help vì những lệnh lỗi đã bị ẩn rồi.",
              "Đây là một con bot được các coder của MiraiProject nhúng tay vào.",
              "Muốn biết sinh nhật của Mint thì hãy xài 'birthday'.",
              "Cặc.",
              "Cút.",
              "Lồn.",
              "Bạn chưa biết.",
              "Bạn đã biết.",
              "Bạn sẽ biết.",
              "Không có gì là hoàn hảo, MintBot là ví dụ.",
              "Mirai dropped.",
              "MintBot là MiraiProject nhưng module là idea của SpermBot.",
              "Bạn không biết cách sử dụng MintBot? Đừng dùng nữa.",
              "Muốn chơi game? Qua bot khác mà chơi đây không rảnh",
              "MintBot có thể hiểu phụ nữ nhưng không thể có được họ.",
              "MintBot cân spam nhưng không có gì đáng để bạn spam."
            ];
            var link = [
              "https://i.imgur.com/K2LIEyw.jpeg",
            ];
            
            var i = 1;
            var msg = [];
            const moment = require("moment-timezone");
            const date = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
            for (const idAdmin of listAdmin) {
              if (parseInt(idAdmin)) {
                const name = await Users.getNameUser(idAdmin);
                msg.push(`${i++} ${name} - ${idAdmin}`);
              }
            }
            var msg1 = [];
                    for (const idNDH of listNDH) {
                        if (parseInt(idNDH)) {
                          const name1 = (await Users.getData(idNDH)).name
                            msg1.push(`${i++} ${name1} - ${idNDH} `);
                        }
                    }
            var callback = () => 
              api.sendMessage({ body: `🌹𝐀𝐃𝐌𝐈𝐍 𝐀𝐍𝐃 𝐁𝐎𝐓 𝐈𝐍FO 🌹
        ─────────────────\n♪♪♪♪♪♪♪『${namebot}』.♪♪♪♪♪♪♪\n─────────────────\n» Prefix system: ${PREFIX}\n» Prefix box: ${prefix}\n» Modules: ${commands.size}\n» Ping: ${Date.now() - dateNow}ms\n» Total users: ${global.data.allUserID.length} \n» Total threads: ${global.data.allThreadID.length} ─────────────────\n╭───────────╮\n🌻 𝙤𝙬𝙣𝙚𝙧 ☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆🌻\n╰───────────╯ ╭────────────╮\n🥀Bot💞 \n╰────────────╯\n🍇:D🍇\n───────────────── https://www.facebook.com/profile.php?id=61555671747709\n─────────────────`, attachment: fs.createReadStream(__dirname + "/cache/kensu.jpg"), }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/kensu.jpg"));
              return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/kensu.jpg")).on("close", () => callback()); 


        // ... (Other logic continues)
    }
};
