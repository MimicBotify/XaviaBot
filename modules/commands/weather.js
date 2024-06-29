const fs = require('fs');
const axios = require('axios');
const request = global.nodemodule["request"];
const moment = global.nodemodule["moment-timezone"];

module.exports.config = {
    name: "weather",
    version: "1.0.1",
    hasPermission: 0,
    credits: "☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆",
    description: "news",
    commandCategory: "other",
    usages: "[Location]",
    cooldowns: 5,
    dependencies: {
        "moment-timezone": "",
        "request": ""
    },
    envConfig: {
        "OPEN_WEATHER": "c4ef85b93982d6627681b056e24bd438"
    }
};

module.exports.languages = {
    "en": {
        "locationNotExist": "Can't find %1.",
        "returnResult": "🌡 Temp: %1℃\n🌡 Feels like: %2℃\n☁️ Sky: %3\n💦 Humidity: %4%\n💨 Wind speed: %5km/h\n🌅 Sun rises: %6\n🌄 Sun sets: %7"
        // Add translations for other languages if needed
    }
}

module.exports.run = async function ({ api, event, args, getText }) {
    const { threadID, messageID } = event;
    const activatedTokens = JSON.parse(fs.readFileSync('activatetokens.json', 'utf8'));
    const isActivated = activatedTokens.some(token => token.threadID === threadID);

    if (!isActivated) {
        return api.sendMessage("Group is not activated. Please activate the group to use the command.", threadID, messageID);
    } else {
        const city = args.join(" ");
        if (city.length === 0) {
            return throwError(this.config.name, threadID, messageID); // Handle empty location
        }

        return request(encodeURI(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${global.configModule[this.config.name].OPEN_WEATHER}&units=metric&lang=${global.config.language}`), (err, response, body) => {
            if (err) {
                console.error(err);
                return api.sendMessage("An error occurred while fetching weather data.", threadID, messageID);
            }

            const weatherData = JSON.parse(body);
            if (weatherData.cod !== 200) {
                return api.sendMessage(getText("locationNotExist", city), threadID, messageID); // Handle non-existent location
            }

            const sunrise_date = moment.unix(weatherData.sys.sunrise).tz("Asia/Ho_Chi_Minh");
            const sunset_date = moment.unix(weatherData.sys.sunset).tz("Asia/Ho_Chi_Minh");
            const returnMessage = getText("returnResult", weatherData.main.temp, weatherData.main.feels_like, weatherData.weather[0].description, weatherData.main.humidity, weatherData.wind.speed, sunrise_date.format('HH:mm:ss'), sunset_date.format('HH:mm:ss'));

            api.sendMessage({
                body: returnMessage,
                location: {
                    latitude: weatherData.coord.lat,
                    longitude: weatherData.coord.lon,
                    current: true
                },
            }, threadID, messageID);
        });
    }
    // other command logic goes here
};
