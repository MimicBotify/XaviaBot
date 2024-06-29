const fs = require('fs');
const axios = require('axios');

//module export goes here
module.exports.config = {
    name: "steal",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "thief",
    commandCategory: "economy",
    usages: "send message",
    cooldowns: 5
};

module.exports.run = async function({ api, event, Users, Currencies }) {
    const { threadID, messageID, senderID, mentions } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));

    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const alluser = global.data.allUserID;
        const victim = alluser[Math.floor(Math.random() * alluser.length)];
        const nameVictim = (await Users.getData(victim)).name;

        if (victim === api.getCurrentUserID() && event.senderID === victim) {
            return api.sendMessage('Sorry, you cannot steal from this person. Please try again.', event.threadID, event.messageID);
        }

        const route = Math.floor(Math.random() * 2);

        if (route === 0) {
            const moneydb = (await Currencies.getData(victim)).money;
            const money = Math.floor(Math.random() * 1000) + 1;

            if (moneydb <= 0 || moneydb === undefined) {
                return api.sendMessage(`You just stole from ${nameVictim}, who is a poor person. So, you have nothing.`, event.threadID, event.messageID);
            } else if (moneydb >= money) {
                await Currencies.increaseMoney(victim, parseInt("-" + money));
                await Currencies.increaseMoney(event.senderID, parseInt(money));

                return api.sendMessage(`You just stole ${money}$ from ${nameVictim} in this group.`, event.threadID, event.messageID);
            } else if (moneydb < money) {
                await Currencies.increaseMoney(victim, parseInt("-" + moneydb));
                await Currencies.increaseMoney(event.senderID, parseInt(moneydb));

                return api.sendMessage(`You just stole ${moneydb} balance of ${nameVictim} in this group.`, event.threadID, event.messageID);
            }
        } else if (route === 1) {
            const name = (await Users.getData(event.senderID)).name;
            const moneyuser = (await Currencies.getData(event.senderID)).money;

            if (moneyuser <= 0) {
                return api.sendMessage("You don't have money, WORK TO GET SOME MONEY..", event.threadID, event.messageID);
            } else {
                const reward = Math.floor(moneyuser / 2);

                await Currencies.increaseMoney(event.senderID, parseInt("-" + moneyuser));
                await Currencies.increaseMoney(victim, parseInt(reward));

                return api.sendMessage(`You have been captured and lost ${moneyuser}$.`, event.threadID, () =>
                    api.sendMessage({
                        body: `Congratulations ${nameVictim}! You caught ${name} and got ${reward}$ as a reward!`,
                        mentions: [{ tag: nameVictim, id: victim }, { tag: name, id: event.senderID }]
                    }, event.threadID, event.messageID)
                );
            }
        }
    }
    //other command logic goes here
};
