const fs = require('fs-extra');
const axios = require('axios');

module.exports.config = {
    name: "chart",
    version: "1.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Create interactive diagrams with top 8 groups",
    commandCategory: "Box Chat",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const inbox = await api.getThreadList(100, null, ['INBOX']);
        const topGroups = inbox.filter(group => group.isSubscribed && group.isGroup)
            .sort((a, b) => b.messageCount - a.messageCount)
            .slice(0, 8);

        const search = topGroups.map(group => `'${group.name}'`);
        const count = topGroups.map(group => group.messageCount);

        const KMath = (data) => data.reduce((a, b) => a + b, 0);
        const full = KMath(count);

        const chartURL = `https://quickchart.io/chart?c={type:'doughnut',data:{labels:[${encodeURIComponent(search)}],datasets:[{label:'${encodeURIComponent('Tương Tác')}',data:[${encodeURIComponent(count)}]}]},options:{plugins:{doughnutlabel:{labels:[{text:'${full}',font:{size:26}},{text:'${encodeURIComponent('Total')}'}]}}}}`;

        const { createReadStream, unlinkSync, writeFileSync } = fs;
        const path = __dirname + `/cache/chart.png`;

        try {
            const { data: stream } = await axios.get(chartURL, { method: 'GET', responseType: 'arraybuffer' });
            writeFileSync(path, Buffer.from(stream, 'utf-8'));
            return api.sendMessage({ body: '', attachment: createReadStream(path) }, threadID, messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while creating the chart.", threadID, messageID);
        }
    }
};
