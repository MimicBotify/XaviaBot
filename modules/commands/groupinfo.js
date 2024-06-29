const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
  name: "groupinfo",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "View your group information",
  commandCategory: "Box",
  usages: "groupinfo",
  cooldowns: 0,
  dependencies: []
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
  const isActivated = activatedTokens.some(token => token.threadID === threadID);

  if (!isActivated) {
    return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
  } else {
    let threadInfo = await api.getThreadInfo(event.threadID);
    var memLength = threadInfo.participantIDs.length;
	let threadMem = threadInfo.participantIDs.length;
	var nameMen = [];
    var gendernam = [];
    var gendernu = [];
    var nope = [];
     for (let z in threadInfo.userInfo) {
     	var gioitinhone = threadInfo.userInfo[z].gender;
     	var nName = threadInfo.userInfo[z].name;
        if(gioitinhone == "MALE"){gendernam.push(z+gioitinhone)}
        else if(gioitinhone == "FEMALE"){gendernu.push(gioitinhone)}
            else{nope.push(nName)}
    };
	var nam = gendernam.length;
    var nu = gendernu.length;
	let qtv = threadInfo.adminIDs.length;
	let sl = threadInfo.messageCount;
	let u = threadInfo.nicknames;
	let icon = threadInfo.emoji;
	let threadName = threadInfo.threadName;
	let id = threadInfo.threadID;
	let sex = threadInfo.approvalMode;
			var pd = sex == false ? 'Turned off' : sex == true ? 'Turned on' : 'Kh';
			var callback = () =>
				api.sendMessage(
					{
						body: `🔧 GC Name: ${threadName}\n🔧 Group ID: ${id}\n🔧 Approval: ${pd}\n🔧 Emoji: ${icon}\n🔧 Information: including ${threadMem} members\n🔧 Number of males: ${nam} members\n🔧 Number of females: ${nu} members\n🔧 With ${qtv} administrators\n🔧 Total number of messages: ${sl} msgs.\n\nMade with ❤️ by: Botify`,
						attachment: fs.createReadStream(__dirname + '/cache/1.png')
					},
					event.threadID,
					() => fs.unlinkSync(__dirname + '/cache/1.png'),
					event.messageID
				);
			return request(encodeURI(`${threadInfo.imageSrc}`))
				.pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
				.on('close', () => callback());
	    }
        //other command logic goes here
    
  
  // Other command logic goes here if needed
};
