const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "antijoin",
    eventType: ["log:subscribe"],
    version: "1.0.0",
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Ban new members from the group"
};

module.exports.run = async function ({ event, api, Threads }) {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        let data = (await Threads.getData(event.threadID)).data;

        if (!data.newMember) return; // If the new member flag is false, do nothing

        if (event.logMessageData.addedParticipants.some(i => i.userFbId === api.getCurrentUserID())) return;

        if (data.newMember) {
            var memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);
            for (let idUser of memJoin) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                api.removeUserFromGroup(idUser, event.threadID, async function (err) {
                    if (err) {
                        data.newMember = false;
                        await Threads.setData(event.threadID, { data });
                        global.data.threadData.set(event.threadID, data);
                        return;
                    }
                    await Threads.setData(event.threadID, { data });
                    global.data.threadData.set(event.threadID, data);
                });
            }
            return api.sendMessage(`[ERROR] - Your group has anti-join activated. Please deactivate it before adding new members.`, event.threadID);
        }
    }
    // Other command logic goes here
};
