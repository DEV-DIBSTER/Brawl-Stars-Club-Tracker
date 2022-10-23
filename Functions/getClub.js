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

    return Response.data || "No Data Found";
};

module.exports = { getClub };