const Configuration = require('./config.json');

const ClubData = require('./Database/ClubData.js');
const ClubGraphs = require('./Database/ClubGraphs.js');
const ClubLogs = require('./Database/ClubLogs.js');
const ClubTracking = require('./Database/ClubTracking.js');
const { isTag } = require('./Functions/isTag.js');
const { getClub } = require('./Functions/getClub.js');

async function StartWorkers(){
    const Clubs = await ClubTracking.find();

    Promise.all(Clubs.map(async (Club) => {
        const OldData = await ClubData.findOne({clubTag: Club.clubTag});
        const ClubResponse = await getClub(Club.clubTag);

        if (OldData == undefined) {
            if (ClubResponse == "No Data Found") return;

            await new ClubData({
                clubTag: ClubResponse.data.tag,
                timeSaved: `${Date.now()}`,
                data: ClubResponse.data
            }).save();
        };

        if (OldData == undefined) return;

        if (Club.isTrackingLogs == true){
            await require('./Workers/ClubLogs.js').run(OldData, ClubResponse)
        };

        if (Club.isTrackingGraphs == true) {

        };

        //Saves the new Data.
        if (ClubResponse == "No Data Found") return;

        await ClubData.findOneAndUpdate({
            clubTag: ClubResponse.data.tag
        },{
            clubTag: ClubResponse.data.tag,
            timeSaved: `${Date.now()}`,
            data: ClubResponse.data
        });        
    }));
};

;(async() => {
    await StartWorkers();
    await require('./Workers/DeleteClubs.js').run();
})();

setInterval( async () => {
    await StartWorkers();
    await require('./Workers/DeleteClubs.js').run();
}, 5 * 60 * 1000);