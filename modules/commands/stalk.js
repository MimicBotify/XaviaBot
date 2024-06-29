const fs = require('fs');
const axios = require('axios');
var cred = "Deku";

module.exports.config = {
    name: "stalk",
    version: "1.0.0",
    hasPermision: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "get info using uid/mention/reply to a message",
    usages: "[reply/uid/@mention/url]",
    commandCategory: "info",
    cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));

    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        try {
            let id;
            if (this.config.credits !== cred) {
                return api.sendMessage(`ulol change credits pa`, event.threadID, event.messageID);
            }
            
            if (args.join().includes('@')) {
                id = Object.keys(event.mentions);
            } else {
                id = args[0] || event.senderID;
            }
            
            if (event.type === "message_reply") {
                id = event.messageReply.senderID;
            } else if (args.join().includes(".com/")) {
                const res = await axios.get(`https://api.reikomods.repl.co/sus/fuid?link=${args.join(" ")}`);
                id = res.data.result;
            }

            const res = await api.getUserInfoV2(id);
            var gender = res.gender == 'male' ? "Male" : res.gender == 'female' ? "Female" : "Not found";
        var birthday = res.birthday == 'Không Có Dữ Liệu' ? "Not found" : res.birthday;
        var love = res.relationship_status == 'Không Có Dữ Liệu' ? "Not found" : res.relationship_status;
        var location = res.location == 'Không Có Dữ Liệu' ? "Not Found" : res.location.name;
        var hometown = res.hometown == 'Không Có Dữ Liệu' ? "Not found" : res.hometown.name;
      var follow = res.follow == 'Không Có Dữ Liệu' ? "Not Found" : res.follow;
      var usern = res.username == 'Không Có Dữ Liệu' ? res.id : res.username;
          var usern1 = res.username == 'Không Có Dữ Liệu' ? "Not Found" : res.username;
          var rs = res.love == 'Không Có Dữ Liệu' ? "None" : res.love.name;
            let callback = function() {
                return api.sendMessage({
                    body: `•——[INFORMATION]——•\n\nName: ${res.name}\nFacebook URL: https://facebook.com/${res.username}\nUsername: ${res.username}\nBirthday: ${birthday}\nFollowers: ${follow}\nGender: ${gender}\nUID: ${res.id}\nLocation: ${location}\nHometown: ${hometown}\nRelationship Status: ${love}\nIn relationship with: ${rs}\n\n•——[INFORMATION]——•`,
                    attachment: fs.createReadStream(__dirname + `/cache/image.png`)
                }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/image.png`), event.messageID);
            };
            
            // Fetching and attaching the user's avatar
            return request(encodeURI(res.avatar)).pipe(fs.createWriteStream(__dirname + `/cache/image.png`)).on("close", callback);
        } catch (err) {
            console.log(err);
            return api.sendMessage(`Error`, event.threadID);
        }
    }
    // Other command logic goes here
};
