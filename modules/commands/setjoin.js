const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "setjoin",
    version: "1.0.4",
    hasPermssion: 1,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Edit text/animated images when new members join",
    commandCategory: "config",
    usages: "[gif/text] [Text or url to download gif image]",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
}

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "..", "events", "cache", "joinGif");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    return;
}

module.exports.languages = {
    "vi": {
        "savedConfig": "Đã lưu tùy chỉnh của bạn thành công! dưới đây sẽ là phần preview:",
        "tagMember": "[Tên thành viên]",
        "tagType": "[Bạn/các bạn]",
        "tagCountMember": "[Số thành viên]",
        "tagNameGroup": "[Tên nhóm]",
        "gifPathNotExist": "Nhóm của bạn chưa từng cài đặt gif join",
        "removeGifSuccess": "Đã gỡ bỏ thành công file gif của nhóm bạn!",
        "invaildURL": "Url bạn nhập không phù hợp!",
        "internetError": "Không thể tải file vì url không tồn tại hoặc bot đã xảy ra vấn đề về mạng!",
        "saveGifSuccess": "Đã lưu file gif của nhóm bạn thành công, bên dưới đây là preview:"
    },
    "en": {
        "savedConfig": "Saved your config, here is preview:",
        "tagMember": "[Member's name]",
        "tagType": "[You/They]",
        "tagCountMember": "[Member number]",
        "tagNameGroup": "[Thread's name]",
        "gifPathNotExist":"Your thread didn't set gif join",
        "removeGifSuccess": "Removed thread's gif!",
        "invaildURL": "Invalid url!",
        "internetError": "Can't load file because url doesn't exist or internet have some problem!",
        "saveGifSuccess": "Saved file gif, here is preview:"
    }
}
module.exports.run = async function ({ api, event, args, Threads, getText }) {
    const { threadID, messageID } = event;
    const { existsSync, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            const msg = args.slice(1, args.length).join(" ");
            var data = (await Threads.getData(threadID)).data;

            switch (args[0]) {
                case "text": {
                    data["customJoin"] = msg;
                    global.data.threadData.set(parseInt(threadID), data);
                    await Threads.setData(threadID, { data });
                    return api.sendMessage(getText("savedConfig"), threadID, function () {
                        const body = msg
                        .replace(/\{name}/g, getText("tagMember"))
                        .replace(/\{type}/g, getText("tagType"))
                        .replace(/\{soThanhVien}/g, getText("tagCountMember"))
                        .replace(/\{threadName}/g, getText("tagNameGroup"));
                        return api.sendMessage(body, threadID);
                    });
                }
                case "gif": {
                    const path = join(__dirname, "..", "events", "cache", "joinGif");
                    const pathGif = join(path, `${threadID}.gif`);
                    if (msg == "remove") {
                        if (!existsSync(pathGif)) return api.sendMessage(getText("gifPathNotExist"), threadID, messageID);
                        unlinkSync(pathGif);
                        return api.sendMessage(getText("removeGifSuccess"), threadID, messageID);
                    }
                    else {
                        if (!msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif|GIF)/g)) return api.sendMessage(getText("invaildURL"), threadID, messageID);
                        try {
                            await global.utils.downloadFile(msg, pathGif);
                        } catch (e) { return api.sendMessage(getText("internetError"), threadID, messageID); }
                        return api.sendMessage({ body: getText("saveGifSuccess"), attachment: createReadStream(pathGif) }, threadID, messageID);
                    }
                }
                default: { return global.utils.throwError(this.config.name, threadID, messageID) }
            }
        } catch (e) { return console.log(e) };
    }
}
