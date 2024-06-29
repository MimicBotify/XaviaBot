const fs = require('fs');
const axios = require('axios');

// Module export goes here
module.exports.config = {
  name: "goibot",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Modded by ☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 6,
};

module.exports.handleEvent = async function ({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Manila").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = ["Ittuu🤏 si shram ker Lya kro hr wqt tr tr krty ho 🙂 💔✨⚠️†", "Banda hota tw us ko choti choti 2 pOniyAn krti🙂👩‍🦯👩‍🦯", "Ary Yahin Hon namony😗", "jiee bndr 😍", "Love you bolongi ab tujhy kaminy", "Miss YoU NaW moi biryani ki plate", "Inna Sarra🤏", "OkkaY chanda ki hun yawr mai", "😁Smile I am Taking Selfy✌️🤳", "🥺Jan nahi kehna to men naraz ho jana he", "bak bk bkaik", "Main ap ki ami ko btaou ₲ł ap Facebook use kerty ho aur ulty kam kalty ho , " ,"Block Your ‘’ gf ‘’ And Purpose me 🙂💔" ,"K0i Perp0Se Hi Krd0 Perm0te T0 hm PhlY hi HaiN 🙂",];
  var rand = tl[Math.floor(Math.random() * tl.length)]

  if ((event.body.toLowerCase() == "good night") || (event.body.toLowerCase() == "gn")) {
     return api.sendMessage("️❤️ Good Night too darling 🥰", threadID, messageID);
   };

   if ((event.body.toLowerCase() == "good morning") || (event.body.toLowerCase() == "gm")) {
     return api.sendMessage("❤️ Good Morning too baby 🥰", threadID);
   };

  
   if ((event.body.toLowerCase() == "hi") || (event.body.toLowerCase() == "hello")) {
     return api.sendMessage("Next Hi/Hello nhi Assalamualaikum Bola kro Okay 💖🤍✨", threadID);
   };

  
   if ((event.body.toLowerCase() == "assalam u alaikum") || (event.body.toLowerCase() == "assalam o laikum")) {
     return api.sendMessage("❤️وَعَلَيْكُم السَّلَام وَرَحْمَةُ اَللهِ", threadID);
   };

  
   if ((event.body.toLowerCase() == "🙄") || (event.body.toLowerCase() == "🙄🙄")) {
     return api.sendMessage("uper kiya bey bhootny bhootnian sary k sary 🙄😈", threadID);
   };

  
   if ((event.body.toLowerCase() == "😒") || (event.body.toLowerCase() == "😒😒")) {
     return api.sendMessage("esy na mujy tm dekho na😒🥺ami ko bta dungi", threadID);
   };

  
   if ((event.body.toLowerCase() == "bye") || (event.body.toLowerCase() == "by")) {
     return api.sendMessage("BYe Allah Hafiz ❤️ ", threadID);
   };
   mess = "{name}"
};

module.exports.run = function({ api, event, client, __GLOBAL }) { }
