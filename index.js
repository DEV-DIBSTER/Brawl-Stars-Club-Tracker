const Mongoose = require('mongoose');
const fs = require('fs');
const Chalk = require('chalk');
const Configuration = require('./config.json');
const Execute = require('child_process').exec;


Mongoose.connect(Configuration.MongoDB)
.then(() => {
    fs.readdirSync('./Database/').forEach(m => {
        require(`./Database/${m}`);
    });
}).then(() => {
    const Divider = Chalk.blueBright('------------------------------------------------------\n');
    const Text = Chalk.redBright('██████╗ ██╗██████╗ ███████╗████████╗███████╗██████╗\n██╔══██╗██║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗\n██║  ██║██║██████╔╝███████╗   ██║   █████╗  ██████╔╝\n██║  ██║██║██╔══██╗╚════██║   ██║   ██╔══╝  ██╔══██╗\n██████╔╝██║██████╔╝███████║   ██║   ███████╗██║  ██║\n╚═════╝ ╚═╝╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝\n');

    console.log(`${Divider}${Text}${Divider}`);    
    console.log(`${Chalk.greenBright(`[Database] | `)}${Chalk.bold.blueBright(`All Database models have been loaded!`)}`);
})

//Now starts executing all the other functions.
.then(async () => {
    require('./app.js'); //Starts the webserver.
})

.then(async () => {
    require('./start-worker.js'); //Starts all the requests and functions.
});

setInterval(() => {
        Execute(`git pull`, (Error, Stdout) => {
            let Response = (Error || Stdout);
            if (!Error) {
                if (Response.includes("Already up to date.")) {

                } else {
                    setTimeout(() => {
                        process.exit();
                    }, 1000)
                }
            }
        })
    }, 30 * 1000);
