module.exports.config = {
  name: "threadguardian",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Botify",
  description: "system",
  commandCategory: "Administrator",
  usages: "N/A",
  cooldowns: 0,
};

module.exports.run = async function({ api, event }) {
  const fs = require('fs');

  async function getCurrentThreads() {
      try {
          console.log('Fetching current threads...');
          const inbox = await api.getThreadList(100, null, ['INBOX']);
          const list = inbox.filter(group => group.isSubscribed && group.isGroup);
          const currentThreads = list.map(group => group.threadID);
          console.log('Current threads fetched:', currentThreads);
          return currentThreads;
      } catch (error) {
          console.error('Error fetching current threads:', error);
          return [];
      }
  }

  function isExpired(expirationDate) {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Set current date to 00:00:00
      const expireDate = new Date(expirationDate);
      expireDate.setHours(0, 0, 0, 0); // Set expiration date to 00:00:00
      return now >= expireDate; // Modified condition to include the expiration date
  }
    async function leaveThread(threadID, reason) {
        try {
            await api.sendMessage(`Leaving the Group..\nReason: ${reason}`, threadID); // Send a message to the thread
            await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
            console.log(`Left thread: ${threadID} successfully`);
        } catch (error) {
            console.error('Error leaving thread:', error);
        }
    }

    function updateActiveTokensFile(updatedTokens) {
        try {
            fs.writeFileSync('activatetokens.json', JSON.stringify(updatedTokens, null, 2), 'utf8');
            console.log('activatetokens.json updated successfully');
        } catch (err) {
            console.error('Error updating activatetokens file:', err);
        }
    }

    function updateTokensFile(updatedTokens) {
        try {
            fs.writeFileSync('tokens.json', JSON.stringify(updatedTokens, null, 2), 'utf8');
            console.log('tokens.json updated successfully');
        } catch (err) {
            console.error('Error updating tokens file:', err);
        }
    }

    async function mainLogic() {
        try {
            await api.sendMessage('Checking threads...', '7176676739042851'); // Send a message to the specified user
            const activeTokensData = fs.readFileSync('activatetokens.json', 'utf8');
            let activeTokens = JSON.parse(activeTokensData);
            const currentThreads = await getCurrentThreads(api);

            const threadsNotInTokens = currentThreads.filter(thread => !activeTokens.some(token => token.threadID === thread));

            for (const threadID of threadsNotInTokens) {
                await leaveThread(threadID, "The group is not acivated. To activate the group contact our Facebook Page:\nhttps://www.facebook.com/profile.php?id=61555671747709");;
            }

            const expiredTokens = activeTokens.filter(token => isExpired(token.expirationDate));
            const threadsInExpiredTokens = expiredTokens.map(token => token.threadID);

            for (const threadID of threadsInExpiredTokens) {
                await leaveThread(threadID, "The subscription has ended. Thanks for using the Bot\nTo use the Bot again contact our page\nFacebook Page:\nhttps://www.facebook.com/profile.php?id=61555671747709\n☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆");
            }

            activeTokens = activeTokens.filter(token => !isExpired(token.expirationDate) || currentThreads.includes(token.threadID));
            updateActiveTokensFile(activeTokens);

            const tokensData = fs.readFileSync('tokens.json', 'utf8');
            let tokens = JSON.parse(tokensData);

            tokens = tokens.filter(token => !isExpired(token.expirationDate) || currentThreads.includes(token.threadID));
            updateTokensFile(tokens);

            await api.sendMessage('Task complete', '7176676739042851'); // Send a message to the specified user
        } catch (error) {
            console.error('Error handling threads:', error);
        }
    }

    mainLogic(); // Execute initially

    // Execute the main logic every 2 minutes
    setInterval(mainLogic, 120000);
  function isWithinTimeframe() {
      const now = new Date();
      const hours = now.getHours();
      return hours >= 0 && hours < 23;
  }

  // Execute the main logic every hour, but only between 12 am and 11 pm
  setInterval(() => {
      if (isWithinTimeframe()) {
          mainLogic();
      }
  }, 3600000); // 3600000 milliseconds = 1 hour
};
