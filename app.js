const ExpressJS = require('express');
const Chalk = require('chalk');
const Configuration = require('./config.json');
const BodyParser = require('body-parser');

const Server = ExpressJS();
Server.set('json spaces', 2);
Server.use(BodyParser.json(), BodyParser.urlencoded({extended: true}));
const ClubData = require('./Database/ClubData.js');
const ClubGraphs = require('./Database/ClubGraphs.js');
const ClubLogs = require('./Database/ClubLogs.js');
const ClubTracking = require('./Database/ClubTracking.js');
const { isTag } = require('./Functions/isTag.js');
const { getClub } = require('./Functions/getClub.js');

Server.all('/tracking/:clubTag', async (Request, Response) => {
    if(Request.method == 'POST'){
        await require('./Endpoints/tracking/post.js').run(Request, Response);
    } else if (Request.method == 'DELETE') {
        await require('./Endpoints/tracking/delete.js').run(Request, Response);
    } else if (Request.method == 'PATCH') {
        await require('./Endpoints/tracking/patch.js').run(Request, Response);
    };
});

Server.all('/data/clublogs/:clubTag', async (Request, Response) => {
    if(Request.method == 'GET'){
        await require('./Endpoints/data/clublogs/get.js').run(Request, Response);
    };
});

Server.all('/data/clubgraphs/:clubTag', async (Request, Response) => {
    if(Request.method == 'GET'){
        await require('./Endpoints/data/clubgraphs/get.js').run(Request, Response);
    };
});

Server.get('/', async (Request, Response) => {
    return Response.status(200).send(`Nice try but this is locked.`);
});

Server.listen(Configuration.Port, function () {
    const Divider = Chalk.blueBright('------------------------------------------------------');

    console.log(`${Divider}`);    
    console.log(`${Chalk.greenBright(`[Server] | `)}${Chalk.bold.blueBright(`Server is online at: ${Configuration.URL} at port ${Configuration.Port}!`)}`);
});