const chalk = require('chalk');
module.exports = (data, option) => {
	switch (option) {
		case "warn":
			console.log(chalk.bold.hex("#FF00FF").bold('[ 𝐄𝐑𝐑𝐎𝐑 ] » ') + data);
			break;
		case "error":
			console.log(chalk.bold.hex("#FF00FF").bold('[ 𝐄𝐑𝐑𝐎𝐑 ] »') + data);
     break;
		default:			        
                        console.log(chalk.bold.hex("#00BFFF").bold(`${option} » `) + data);
			break;
	}
}

module.exports.loader = (data, option) => {
	switch (option) {
		case "warn":
			console.log(chalk.bold.hex("#00FFFF").bold('[☆*:.｡.ᏼó𝑡ị𝙛ⲩ.｡.:*☆] » ') + data);
			break;
		case "error":
			console.log(chalk.bold.hex("#00FFFF").bold('[Tanvir] » ') + data);
			break;
		default:
			console.log(chalk.bold.hex("#00FFFF").bold(`[Aka Tanvir] » `) + data);
			break;
	}
	}