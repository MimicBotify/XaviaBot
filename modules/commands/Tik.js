const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "tik",
    version: "",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Tải video tik tok xóa logo",
    commandCategory: "media",
    usages: "[url]",
    cooldowns: 10,
    dependencies: {
        "tiktok-scraper": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        if (!args[0]) return api.sendMessage("Bạn phải nhập url video tiktok !!!", threadID, messageID);

        const url = args[0];
        try {
            const response = await axios.get(url, {
                params: {
                    noWaterMark: true,
                    hdVideo: true
                }
            });
            
            const videoMeta = response.data.item[0];
            const videoID = videoMeta.id;
            const author = videoMeta.authorMeta.name;
            
            const videoUrl = `https://video-nwm.p.rapidapi.com/url/` + videoID;

            const videoResponse = await axios({
                method: 'GET',
                url: videoUrl,
                params: { url: `https://vt.tiktok.com/@${author}/${videoID}` },
                headers: {
                    'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY',
                    'x-rapidapi-host': 'video-nwm.p.rapidapi.com'
                },
                responseType: 'arraybuffer'
            });

            const videoBuffer = videoResponse.data;
            const filePath = `/cache/${threadID}-${senderID}.mp4`;

            fs.writeFileSync(__dirname + filePath, Buffer.from(videoBuffer, 'utf-8'));

            if (fs.statSync(__dirname + filePath).size > 25000000) {
                fs.unlinkSync(__dirname + filePath);
                return api.sendMessage("Không thể gửi file vì dung lượng lớn hơn 25MB.", threadID, messageID);
            } else {
                return api.sendMessage({
                    body: "Loading success ✅",
                    attachment: fs.createReadStream(__dirname + filePath)
                }, threadID, () => fs.unlinkSync(__dirname + filePath));
            }
        } catch (error) {
            return api.sendMessage('Your request could not be processed!', threadID, messageID);
        }
    }
}
