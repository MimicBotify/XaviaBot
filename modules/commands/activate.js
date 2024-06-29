const fs = require('fs');

const isTokenActivated = (userProvidedToken, activatedTokens) => {
    return activatedTokens.some(({ generatedToken }) =>
        generatedToken === userProvidedToken
    );
};

module.exports.config = {
    name: "activate",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "Activate thread by a token",
    commandCategory: "User",
    usages: "/activate [token]",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 300000
    }
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID } = event;
    const userProvidedToken = args[0];

    try {
        // Fetch stored tokens from tokens.json
        const storedTokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

        const tokenInfo = storedTokens.find(({ generatedToken }) =>
            generatedToken === userProvidedToken
        );

        if (!tokenInfo) {
            return api.sendMessage("Invalid or expired token! Subscription not activated.", threadID);
        }

        // Fetch activated tokens from activatetokens.json
        const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8')) || [];

        const isActivated = isTokenActivated(userProvidedToken, activatedTokens);

        if (isActivated) {
            return api.sendMessage("Token is already activated!", threadID);
        }

        // Store validated token and threadID in activatetokens.json
        const { generatedToken, expirationDate } = tokenInfo;

        const newActivatedToken = {
            generatedToken,
            expirationDate,
            threadID
        };

        activatedTokens.push(newActivatedToken);
        fs.writeFileSync('activatetokens.json', JSON.stringify(activatedTokens, null, 2));

        return api.sendMessage("Token is valid! Subscription activated.", threadID);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return api.sendMessage("An error occurred while validating the token.", threadID);
    }
};
