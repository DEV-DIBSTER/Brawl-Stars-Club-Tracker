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

Server.post('/tracking/:clubTag', async (Request, Response) => {
    if(!Configuration.APITokens.some(Token => Token == Request.headers.password)) return Response.status(403).send('Invalid authentication.');

    const Input = Request.params.clubTag;
    if(isTag(Input.replace('#', '').replace('%23', '')) == false) return Response.status(404).send('Invalid club tag characters!');

    const ClubResponse = await getClub(Input.replace('#', '').replace('%23', ''));
    if(ClubResponse == "No Data Found") return Response.status(404).send('Invalid club tag characters!');
    
    const JSONResponse = Request.body;

    if(typeof JSONResponse.isTrackingGraphs == 'boolean') return Response.status(404).send('Invalid body arguements!');
    if(typeof JSONResponse.isTrackingLogs == 'boolean') return Response.status(404).send('Invalid body arguements!');

    const IfOldData = await ClubTracking.findOne({
        clubTag: ClubResponse.tag
    });

    const NewClubTracking = await ClubTracking.create({
        clubTag: ClubResponse.tag,
        timeSaved: `${Date.now()}`,
        isTrackingLogs: JSONResponse.isTrackingLogs,
        isTrackingGraphs: JSONResponse.isTrackingGraphs
    });

    NewClubTracking.save();

    await Response.status(200).send({
        message: "Success",
        ClubTag: ClubResponse.tag,
        isTrackingLogs: JSONResponse.isTrackingLogs,
        isTrackingGraphs: JSONResponse.isTrackingGraphs
    });
});

Server.delete('/tracking/:clubTag', async (Request, Response) => {
    if(!Configuration.APITokens.some(Token => Token == Request.headers.password)) return Response.status(403).send('Invalid authentication.');

    const Input = Request.params.clubTag;
    if(isTag(Input.replace('#', '').replace('%23', '')) == false) return Response.status(404).send('Invalid club tag characters!');

    const ClubResponse = await getClub(Input.replace('#', '').replace('%23', ''));
    if(ClubResponse == "No Data Found") return Response.status(404).send('Invalid club tag characters!'); 
});

Server.get('/', async (Request, Response) => {
    return Response.status(200).send(`Nice try but this is locked.`);
});

Server.listen(Configuration.Port, function () {
    const Divider = Chalk.blueBright('------------------------------------------------------');

    console.log(`${Divider}`);    
    console.log(`${Chalk.greenBright(`[Server] | `)}${Chalk.bold.blueBright(`Server is online at: ${Configuration.URL} at port ${Configuration.Port}!`)}`);
});