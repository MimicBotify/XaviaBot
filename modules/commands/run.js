module.exports.config = {
	name: "run",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
	description: "running shell",
	commandCategory: "system",
	usages: "[Script]",
	cooldowns: 5,
	dependencies: {
		"eval": ""
	}
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {
    const permission = ["100039556069166"];
             if (!permission.includes(event.senderID))
             return api.sendMessage("☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆ only can use this command", event.threadID, event.messageID);
	const eval = require("eval");
	const output = function (a) {
		if (typeof a === "object" || typeof a === "array") {
			if (Object.keys(a).length != 0) a = JSON.stringify(a, null, 4);
			else a = "";
		}

		if (typeof a === "number") a = a.toString();
		
		return api.sendMessage(a, event.threadID, event.messageID);
	}
	try {
		const response = await eval(args.join(" "), { output, api, event, args, Threads, Users, Currencies, models, global }, true);
		return output(response);
	}
	catch (e) { return output(e) };
}