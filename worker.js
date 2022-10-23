const Configuration = require('./config.json');

const ClubData = require('./Database/ClubData.js');
const ClubGraphs = require('./Database/ClubGraphs.js');
const ClubLogs = require('./Database/ClubLogs.js');
const ClubTracking = require('./Database/ClubTracking.js');
const { isTag } = require('./Functions/isTag.js');
const { getClub } = require('./Functions/getClub.js');

;(async() => {
    const Clubs = await ClubTracking.find();

    Promise.all(Clubs.map(async (Club) => {
        const OldData = await ClubData.findOne({
            clubTag: Club.clubTag
        });

        if(OldData == undefined) {
            const ClubResponse = await getClub(Club.clubTag);
            if(ClubResponse == "No Data Found") return;

            const NewData = new ClubData({
                clubTag: ClubResponse.tag,
                timeSaved: `${Date.now()}`,
                data: ClubResponse
            });

            NewData.save();
        };


        if(Club.isTrackingLogs == true){
        
        };

        if(Club.isTrackingGraphs == true) {

        };
    }));
})();