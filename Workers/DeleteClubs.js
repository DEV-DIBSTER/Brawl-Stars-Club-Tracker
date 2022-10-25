const ClubTracking = require('../Database/ClubTracking.js');
const ClubLogs = require('../Database/ClubLogs.js');
const ClubGraphs = require('../Database/ClubGraphs.js');
const ClubData = require('../Database/ClubData.js');

module.exports = ({
    run: async () => {
        const ActiveClubs = await ClubTracking.find({});
    
        const ActiveClubLogs = await ClubLogs.find({});
        const ActiveClubGraphs = await ClubGraphs.find({});
        const ActiveClubData = await ClubData.find({});

        let ClubsThatDisabledTracking1 = ActiveClubLogs.filter(
            (f) =>
                !ActiveClubs.some((d) => d.clubTag === f.club.tag)
        );

        let ClubsThatDisabledTracking2 = ActiveClubGraphs.filter(
            (f) =>
                !ActiveClubs.some((d) => d.clubTag === f.club.tag),
        );
    
        let ClubsThatDisabledTracking3 = ActiveClubData.filter(
            (f) =>
                !ActiveClubs.some((d) => d.clubTag === f.data.tag),
        );
    
        Promise.all(ClubsThatDisabledTracking1.map(async (Club) => {
            await ClubLogs.findOneAndDelete({_id: Club._id});
        }));
    
        Promise.all(ClubsThatDisabledTracking2.map(async (Club) => {
            await ClubGraphs.findOneAndDelete({_id: Club._id});
        }));
    
        Promise.all(ClubsThatDisabledTracking3.map(async (Club) => {
            await ClubData.findOneAndDelete({_id: Club._id});
        }));
    }
});