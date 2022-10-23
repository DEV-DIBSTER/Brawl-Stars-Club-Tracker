const Express = require('express');
const Configuration = require('../config.json');

const ClubData = require('../Database/ClubData.js');
const ClubGraphs = require('../Database/ClubGraphs.js');
const ClubLogs = require('../Database/ClubLogs.js');
const ClubTracking = require('../Database/ClubTracking.js');
const { isTag } = require('../Functions/isTag.js');
const { getClub } = require('../Functions/getClub.js');

module.exports = ({
    /**
     * @param {Express.Request} Request
     * @param {Express.Response} Response 
     */
    run: async (Request, Response) => {
        if(!Configuration.APITokens.some(Token => Token == Request.headers.password)) return Response.status(403).send('Invalid authentication.');

        const Input = Request.params.clubTag;
        if(isTag(Input.replace('#', '').replace('%23', '')) == false) return Response.status(404).send('Invalid club tag characters!');

        const ClubResponse = await getClub(Input.replace('#', '').replace('%23', ''));
        if(ClubResponse == "No Data Found") return Response.status(404).send('Invalid club tag characters!');
        
        const JSONResponse = Request.body;

        if(JSONResponse.hasOwnProperty('isTrackingGraphs') == false || typeof JSONResponse.isTrackingGraphs != 'boolean') return Response.status(404).send('Invalid body arguements!');
        if(JSONResponse.hasOwnProperty('isTrackingLogs') == false || typeof JSONResponse.isTrackingLogs != 'boolean') return Response.status(404).send('Invalid body arguements!');

        const OldData = await ClubTracking.findOne({
            clubTag: ClubResponse.tag
        });

        if(OldData == undefined) return Response.status(404).send('The club with this tag is not being tracked!');

        await ClubTracking.findOneAndUpdate({
            clubTag: ClubResponse.tag
        }, {
            isTrackingLogs: JSONResponse.isTrackingLogs,
            isTrackingGraphs: JSON.isTrackingGraphs
        }).catch(console.error);

        await Response.status(202).send({
            message: "Successfully changed club in tracking.",
            ClubTag: ClubResponse.tag,
            isTrackingLogs: JSONResponse.isTrackingLogs,
            isTrackingGraphs: JSONResponse.isTrackingGraphs
        });
    }
});