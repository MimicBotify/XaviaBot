const { exec } = require("child_process");
const fs = require("fs");

// Function to generate a token and expiration date for different subscription periods
const generateToken = (subscriptionType) => {
    let generatedToken;
    let expirationDate;

    switch (subscriptionType) {
        case "weekly":
            generatedToken = require('crypto').randomBytes(8).toString('hex');
            expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
        case "monthly":
            generatedToken = require('crypto').randomBytes(8).toString('hex');
            expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
        default:
            throw new Error("Invalid subscription type. Usage: generate <weekly|monthly>");
    }

    console.log("Token generated and stored:");
    console.log(`Token: ${generatedToken}`);
    console.log(`Expiration Date: ${expirationDate}`);

    const tokenData = { generatedToken, expirationDate };
    const tokens = fs.existsSync('tokens.json') ? JSON.parse(fs.readFileSync('tokens.json')) : [];
    tokens.push(tokenData);
    fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2));

    return { generatedToken, expirationDate };
};

// Function to validate a token
const validateToken = (userProvidedToken, tokens) => {
    const currentTimestamp = Date.now();

    const tokenInfo = tokens.find(({ generatedToken, expirationDate }) =>
        userProvidedToken === generatedToken && new Date(expirationDate).getTime() >= currentTimestamp
    );

    if (tokenInfo) {
        console.log("Token is valid! Subscription activated.");
        // Add actions for activating subscription in the group chat
        return true;
    } else {
        console.log("Invalid or expired token! Subscription not activated.");
        return false;
    }
};

module.exports.config = {
    name: "generatetoken",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "N/A",
    commandCategory: "Administrator",
    usages: "generatetoken [weekly/monthly]",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 300000
    }
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID } = event;

    const isAdmin = global.config.ADMINBOT.includes(senderID.toString());
    if (!isAdmin) return api.sendMessage("This command is not available for user\n☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆", threadID);

    const subscriptionType = args[0];
    if (!subscriptionType || !["weekly", "monthly"].includes(subscriptionType.toLowerCase()))
        return api.sendMessage("Please provide a valid subscription type: [weekly/monthly]", threadID);

    try {
        const { generatedToken, expirationDate } = generateToken(subscriptionType);
        await api.sendMessage(`Token: ${generatedToken}\nExpiration Date: ${expirationDate}`, threadID);
        await api.sendMessage(`/activate ${generatedToken}`, threadID);

        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return api.sendMessage("An error occurred while generating the token.", threadID);
    }
};
