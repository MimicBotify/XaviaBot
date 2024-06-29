const fs = require('fs');
const axios = require('axios');
const Innertube = require('youtubei.js');

module.exports.config = {
    name: "music",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Play music from youtube",
    commandCategory: "utility",
    usages: "[title]",
    cooldowns: 10,
    dependencies: {}
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let input = body.substring(7).trim();

        if (!input) {
            return api.sendMessage("⚠️Please put a title or name of the music.", threadID);
        }

        const youtube = new Innertube();
        const search = await youtube.search(input);

        if (!search.videos[0]) {
            return api.sendMessage("Error: Invalid request.", threadID, messageID);
        }

        const stream = youtube.download(search.videos[0].id, {
            format: 'mp4',
            type: 'audio',
            audioQuality: 'lowest',
            loudnessDB: '20',
            audioBitrate: '320',
            fps: '30'
        });

        api.sendMessage(`🔎Searching for "${input}"...`, threadID, messageID);
        api.setMessageReaction("✅", messageID, (err) => {}, true);

        const filePath = __dirname + `/cache/${search.videos[0].title}.mp3`;

        stream.pipe(fs.createWriteStream(filePath));

        stream.on('info', (info) => {
            console.info('[DOWNLOADER]', `Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`);
            console.log(info);
        });

        stream.on('end', () => {
            console.info('[DOWNLOADER]', 'Downloaded');
            const message = {
                body: "Here's your music, enjoy!🥰\n\nTitle: " + search.videos[0].title,
                attachment: [fs.createReadStream(filePath)]
            };
            api.sendMessage(message, threadID, messageID);

            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error(err);
                    console.log(`${filePath} is deleted!`);
                });
            }
        });

        stream.on('error', (err) => {
            console.error('[ERROR]', err);
            api.sendMessage("An error occurred while processing your request.", threadID, messageID);
        });
    }
};
