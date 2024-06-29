lmodule.exports.config = {
    name: "file",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Delete the file or folder in the commands folder",
    commandCategory: "Admin",
    usages: "\ncommands start <text>\ncommands ext <text>\ncommands <text>\ncommands [blank]\ncommands help\nNOTE: <text> is the character you enter as you like",
    cooldowns: 5
};

module.exports.handleReply = ({ api, event, args, handleReply }) => {
    if(event.senderID != handleReply.author) return; 
    const fs = require("fs-extra");
  var arrnum = event.body.split(" ");
  var msg = "";
  var nums = arrnum.map(n => parseInt(n));

  for(let num of nums) {
    var target = handleReply.files[num-1];
    var fileOrdir = fs.statSync(__dirname+'/'+target);
        if(fileOrdir.isDirectory() == true) {
          var typef = "[Folder🗂️]";
          fs.rmdirSync(__dirname+'/'+target, {recursive: true});
        }
        else if(fileOrdir.isFile() == true) {
          var typef = "[File📄]";
          fs.unlinkSync(__dirname+"/"+target);
        }
        msg += typef+' '+handleReply.files[num-1]+"\n";
  }
  api.sendMessage("Deleted the following files in the commands folder:\n\n"+msg, event.threadID, event.messageID);
}


module.exports.run = async function({ api, event, args, Threads }) {
  
  const fs = require("fs-extra");
    const permission = ["100039556069166"];
  	if (!permission.includes(event.senderID)) return api.sendMessage("This command is not available for user.\n☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆", event.threadID, event.messageID);
  var files = fs.readdirSync(__dirname+"/") || [];
  var msg = "", i = 1;
  
//

  if(args[0] == 'help') {
    var msg = `
Cách dùng lệnh:
•Key: start <text>
•Tác dụng: Lọc ra file cần xóa có ký tự bắt đầu tùy chọn
•Ví dụ: commands rank
•Key: ext <text>
•Tác dụng: Lọc ra file cần xóa có đuôi tùy chọn
•Tác dụng: lọc ra các file trong tên có text tùy chỉnh
•Ví dụ: commands a
•Key: để trống
•Tác dụng: lọc ra tất cả các file trong cache
•Ví dụ: commands
•Key: help
•Tác dụng: xem cách dùng lệnh
•Ví dụ: commands help`;
    
    return api.sendMessage(msg, event.threadID, event.messageID);
  }
  else if(args[0] == "start" && args[1]) {
    var word = args.slice(1).join(" ");
    var files = files.filter(file => file.startsWith(word));
    
    if(files.length == 0) return api.sendMessage(`There are no files in the cache that begin with: ${word}`, event.threadID ,event. messageID);
    var key = `There  are ${files.length} files. The file has a character that starts with .: ${word}`;
  }
  
  //ଜ଼ିଆରେଇଁ..... 
  else if(args[0] == "ext" && args[1]) {
    var ext = args[1];
    var files = files.filter(file => file.endsWith(ext));
    
    if(files.length == 0) return api.sendMessage(`There are no files in the commands that have a character ending in .: ${ext}`, event.threadID ,event. messageID);
    var key = `There ${files.length} file has the extension: ${ext}`;
  }
  //all file
  else if (!args[0]) {
    if(files.length == 0) return api.sendMessage("Your commands have no files or folders", event.threadID ,event. messageID);
  var key = "All files in the commands folder:";
  }
  //trong tên có ký tự.....
  else {
    var word = args.slice(0).join(" ");
    var files = files.filter(file => file.includes(word));
    if(files.length == 0) return api.sendMessage(`There are no files in the name with the character: ${word}`, event.threadID ,event. messageID);
    var key = `There are ${files.length} file in the name has the character: ${word}`;
  }
  
    files.forEach(file => {
        var fileOrdir = fs.statSync(__dirname+'/'+file);
        if(fileOrdir.isDirectory() == true) var typef = "[Folder🗂️]";
        if(fileOrdir.isFile() == true) var typef = "[File📄]";
        msg += (i++)+'. '+typef+' '+file+'\n';
    });
    
     api.sendMessage(`⚡️Reply message by number to delete the corresponding file, can rep multiple numbers, separated by space.\n${key}\n\n`+msg, event.threadID, (e, info) => global.client.handleReply.push({
    name: this.config.name,
    messageID: info.messageID,
    author: event.senderID,
    files
  }))
 
} 