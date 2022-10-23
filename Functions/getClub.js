const Axios = require('axios');
const fs = require('fs');
const Chalk = require('chalk');

const BaseURL = 'https://dibster.is-a.tech/v1';
const Configuration = require('../config.json');

const { isTag } = require('./isTag.js');


async function getClub(ClubTag){
    if(isTag(`${ClubTag.replace('#', '')}`) == false) return;

    const Response = await Axios({
        url: `${BaseURL}/clubs/%23${ClubTag.replace('#', '')}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${Configuration.BrawlStarsToken}`,
        }
    }).catch(Error => {
        fs.writeFileSync(`./Errors/Error-${(fs.readdirSync('./Errors/').length + 1)}.txt`, `${Error}`);
        console.log(`${Chalk.redBright(`[Error] | `)}${Chalk.bold.blueBright(`An error has occured. File: ${__filename} Error Log: ./Errors/Error-${(fs.readdirSync('./Errors/').length + 1)}.txt`)}`);
    });

    if(Response.status == 200){
        return {
            data: {
                tag: Response.data.tag,
                name: Response.data.name,
                description: Response.data.description || null,
                type: Response.data.type,
                badgeId: Response.data.badgeId,
                requiredTrophies: Response.data.requiredTrophies,
                trophies: Response.data.trophies,
                members: Response.data.members,
                isFull: Response.data.members.length == 100
            },
            error: false,
            status: Response.status,
            statusText: Response.statusTxt
        };
    } else if (Response.status == 403 || Response.status == 503 || Response.status == 400 || Response.status == 429 || Response.status == 500) {
        return {
            data: null,
            error: true,
            status: Response.status,
            statusText: Response.statusText
        };
    } else if (Response.status == 404){
        return "No Data Found";
    };
};

module.exports = { getClub };