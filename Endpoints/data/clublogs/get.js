const Express = require('express');
const Configuration = require('../../../config.json');

const ClubData = require('../../../Database/ClubData.js');
const ClubGraphs = require('../../../Database/ClubGraphs.js');
const ClubLogs = require('../../../Database/ClubLogs.js');
const ClubTracking = require('../../../Database/ClubTracking.js');
const { isTag } = require('../../../Functions/isTag.js');
const { getClub } = require('../../../Functions/getClub.js');

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

        const ClubData = await ClubTracking.findOne({
            clubTag: ClubResponse.data.tag
        });

        if(ClubData == undefined) return Response.status(404).send('The club with this tag is not being tracked!');

        if(ClubData.isTrackingLogs == false) return Response.status(404).send('This club is not tracking club logs!');

        const ClublogsData = await (await ClubLogs.find()).filter(m => m.club.tag == ClubResponse.data.tag);

        return Response.status(200).send(ClublogsData[0].toJSON());
    }
});