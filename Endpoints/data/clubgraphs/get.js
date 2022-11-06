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

        return Response.status(200).send('Clublogs are still a work in progress, please try again later!');
    }
});