const fs = require('fs-extra');

module.exports.config = {
    name: "clearcache",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Delete cache file/folder",
    commandCategory: "system",
    usages: "",
    cooldowns: 2
};

module.exports.run = async function ({ event, api, args }) {
    const permission = [`100039556069166`];
    if (!permission.includes(event.senderID)) 
        return api.sendMessage("This command is not available for you.", event.threadID, event.messageID);
  
    if (!args[0]) 
        return api.sendMessage('Please provide the file extension to delete.', event.threadID, event.messageID);

    const directory = __dirname + '/cache';
    if (!fs.existsSync(directory)) 
        return api.sendMessage('Cache directory not found.', event.threadID, event.messageID);

    const fileList = fs.readdirSync(directory).filter(item => item.endsWith("." + args[0]));
    if (!fileList.length) 
        return api.sendMessage('No files found with the given extension.', event.threadID, event.messageID);

    const fileListMessage = fileList.join('\n');
    api.sendMessage(`${fileListMessage}\n\nConfirm deletion of these files by replying with 'Y'.`, event.threadID, (error, info) => {
        if (error) console.log(error);
        global.client.handleReply.push({
            step: 0,
            name: this.config.name,
            fileExtension: args[0],
            messageID: info.messageID,
            author: event.senderID
        });
    });
};

module.exports.handleReply = async function ({ event, api, handleReply }) {
    const { author, fileExtension, messageID } = handleReply;
    if (author !== event.senderID) return;

    if (event.body.toUpperCase() === "Y") {
        const directory = __dirname + '/cache';
        const fileList = fs.readdirSync(directory).filter(item => item.endsWith("." + fileExtension));

        for (const file of fileList) {
            fs.unlinkSync(`${directory}/${file}`);
        }

        return api.sendMessage(`Deleted ${fileList.length} files with the extension ${fileExtension}`, event.threadID);
    } else {
        return api.sendMessage(`Deletion cancelled.`, event.threadID);
    }
};
