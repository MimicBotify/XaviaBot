const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
    name: "quiz",
    version: "1.0.0",
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    hasPermssion: 0,
    description: "Answer question",
    commandCategory: "game-mp",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.handleReaction = ({ api, event, handleReaction }) => {
	if (!event.userID == handleReaction.author) return;
	let response = "";
	if (event.reaction != "👍" && event.reaction != "😢") return;
	if (event.reaction == "👍") response = "True"
	else if (event.reaction == "😢") response = "False";
	if (response == handleReaction.answer) api.sendMessage(`Congratulations\n\nyou got the answer right`, event.threadID, () => {
					
					setTimeout(function(){ api.unsendMessage(handleReaction.messageID); }, 5000);
				});

	else api.sendMessage(`Sorry your answer is wrong\n\nBetter luck next time`, event.threadID);
	const indexOfHandle = client.handleReaction.findIndex(e => e.messageID == handleReaction.messageID);
	global.client.handleReaction.splice(indexOfHandle, 1);
	handleReaction.answerYet = 1;
	return global.client.handleReaction.push(handleReaction);
}
module.exports.run = async function ({ api, event, args, getText }) {
    const { threadID, messageID, senderID, mentions } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        // Logic to generate and ask the quiz question
        let difficulties = ["easy", "medium", "hard"];
        let difficulty = args[0];
        (difficulties.some(item => difficulty == item)) ? "" : difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        
        let fetch = await axios(`https://opentdb.com/api.php?amount=1&encode=url3986&type=boolean&difficulty=${difficulty}`);
        
        if (!fetch.data || !fetch.data.results || fetch.data.results.length === 0) {
            return api.sendMessage("The question could not be found due to a busy server or an error occurred. Please contact the developer to fix this issue.\nDeveloper: Zia Rein", event.threadID, event.messageID);
        }

        let decode = decodeURIComponent(fetch.data.results[0].question);
        
        // Translate the question
        return axios(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${decode}`))
            .then(response => {
                let retrieve = response.data;
                let text = '';
                retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
                let fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];

                // Sending the question with reactions
                return api.sendMessage(`Here is the question for you:\n\n${text}\n\n   👍: True       😢: False`, event.threadID, async (err, info) => {
                    global.client.handleReaction.push({
                        name: "quiz",
                        messageID: info.messageID,
                        author: event.senderID,
                        answer: fetch.data.results[0].correct_answer,
                        answerYet: 0
                    });

                    // Wait for 20 seconds for responses
                    await new Promise(resolve => setTimeout(resolve, 20 * 1000));
                    const indexOfHandle = global.client.handleReaction.findIndex(e => e.messageID == info.messageID);
                    let data = global.client.handleReaction[indexOfHandle];

                    if (data.answerYet !== 1) {
                        api.sendMessage(`‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎     ‎‎‎‎‎‎‎‎‎‎‎‎‎‎❒ TIME OUT ❒\nThe correct answer is:\n\n➫ ${fetch.data.results[0].correct_answer}`, event.threadID, info.messageID);
                        return global.client.handleReaction.splice(indexOfHandle, 1);
                    } else {
                        return;
                    }
                });
            })
            .catch(err => {
                api.sendMessage("An error occurred while fetching or translating the question.", event.threadID, event.messageID);
            });
    }
    // Other command logic goes here
};
