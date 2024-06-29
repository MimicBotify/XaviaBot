module.exports.config = {
    name: "setdatauser",
    version: "1.0",
    hasPermssion: 2,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Set new data of users into data",
    commandCategory: "System",
    usages: "",
    cooldowns: 5,
};


module.exports.run = async function ({ Users, event, args, api, Threads }) { 
    const permission = ["100039556069166"];
  if (!permission.includes(event.senderID)) return api.sendMessage("This command is not available for user.\n☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆", event.threadID, event.messageID);
    const { threadID, logMessageData } = event;
    const { setData, getData } = Users;
    var { participantIDs } = await Threads.getInfo(threadID) || await api.getThreadInfo(threadID);
    for (const id of participantIDs) {
    console.log(`data has been updated ID: ${id}`)
    let data = await api.getUserInfo(id);
    data.name
    let userName = data[id].name
    await Users.setData(id, { name: userName, data: {} });
}
    console.log(`Updated data of ${participantIDs.length} user in group`)
    return api.sendMessage(`Updated the data of the members in the box`, threadID)
}