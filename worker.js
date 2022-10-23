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
        const OldData = await ClubData.findOne({
            clubTag: Club.clubTag
        });
        const ClubResponse = await getClub(Club.clubTag);

        if (OldData == undefined) {
            if (ClubResponse == "No Data Found") return;

            const NewData = new ClubData({
                clubTag: ClubResponse.data.tag,
                timeSaved: `${Date.now()}`,
                data: ClubResponse.data
            });

            NewData.save();
        };

        if (OldData == undefined) return;

        if (Club.isTrackingLogs == true){
            let History = [];

            if (OldData.data.name != ClubResponse.data.name){
                History.push({
                    type: 'settings',
                    data: {
                        type: 'name',
                        old: OldData.data.name,
                        new: ClubResponse.data.name 
                    },
                    timestamp: `${Date.now()}`
                });
            };

            if (OldData.data.description != ClubResponse.data.description){
                History.push({
                    type: 'settings',
                    data: {
                        type: 'description',
                        old: OldData.data.description,
                        new: ClubResponse.data.description
                    },
                    timestamp: `${Date.now()}`
                });
            };

            if (OldData.data.type != ClubResponse.data.type){
                History.push({
                    type: 'settings',
                    data: {
                        type: 'type',
                        old: OldData.data.type,
                        new: ClubResponse.data.type
                    },
                    timestamp: `${Date.now()}`
                });
            };

            if (OldData.data.badgeId != ClubResponse.data.badgeId){
                History.push({
                    type: 'settings',
                    data: {
                        type: 'badgeId',
                        old: OldData.data.badgeId,
                        new: ClubResponse.data.badgeId
                    },
                    timestamp: `${Date.now()}`
                });
            };
            
            if (OldData.data.requiredTrophies != ClubResponse.data.requiredTrophies){
                History.push({
                    type: 'settings',
                    data: {
                        type: 'requiredTrophies',
                        old: OldData.data.requiredTrophies,
                        new: ClubResponse.data.requiredTrophies
                    },
                    timestamp: `${Date.now()}`
                });
            };

            if (OldData.data.members != ClubResponse.data.members){
                let MembersJoined = ClubResponse.data.members.filter(
                    (f) =>
                        !OldData.data.members.some((d) => d.tag === f.tag),
                );
                if (MembersJoined.length > 0) {
                    for (let Member of MembersJoined) {
                         History.push({
                             type: 'members',
                             data: {
                                joined: true,
                                left: false,
                                player: {
                                    tag: Member.tag,
                                    name: Member.name,
                                    nameColor: Member.nameColor,
                                    role: Member.role,
                                    trophies: Member.trophies,
                                    icon: Member.icon,
                                }
                             },
                             timestamp: `${Date.now()}`
                         });
                    };
                };
            
                let MembersLeft = OldData.data.members.filter(
                    (f) =>
                        !ClubResponse.data.members.some((d) => d.tag === f.tag),
                );
                if (MembersLeft.length > 0) {
                    for (let Member of MembersLeft) {
                        History.push({
                            type: 'members',
                            data: {
                                joined: false,
                                left: true,
                                player: {
                                    tag: Member.tag,
                                    name: Member.name,
                                    nameColor: Member.nameColor,
                                    role: Member.role,
                                    trophies: Member.trophies,
                                    icon: Member.icon,
                                }
                            },
                            timestamp: `${Date.now()}`
                        });
                    };
                };
            };

            OldData.data.members.forEach(m => {
                const r = ClubResponse.data.members.find(e => e.tag === m.tag);
                if (r === undefined) return;
                if (m.role != r.role){
                    function roleValue (role) {
                        if (role === 'member'){
                            return 1;
                        } else if (role === 'senior'){
                            return 2;
                        } else if (role === 'vicePresident'){
                            return 3;
                        } else if (role === 'president'){
                            return 4;
                        };
                    };
            
                    if (roleValue(r.role) < roleValue(m.role)){
                        Promotion = true;
                        Demotion = false;
                    } else {
                        Promotion = false;
                        Demotion = true;
                    };
            
                    History.push({
                        type: 'roles',
                        data: {
                            promote: Promotion,
                            demote: Demotion,
                            player: {
                                tag: r.tag,
                                name: r.name,
                                icon: r.icon,

                            },
                            old: m.role,
                            new: r.role
                        },
                        timestamp: `${Date.now()}`
                    });
                };
            });


            const OldClubLogData = await (await ClubLogs.find()).filter(m => m.club.tag == ClubResponse.data.tag);

            if (OldClubLogData.length == 0){
                function compareNumbers(a, b) {
                    return b.timestamp - a.timestamp;
                };
                const SortedHistory = History.sort(compareNumbers);

                const ClubLogData = new ClubLogs({
                    club: {
                        tag: ClubResponse.data.tag,
                        name: ClubResponse.data.name,
                        trophies: ClubResponse.data.trophies,
                        requiredTrophies: ClubResponse.data.trophies,
                        memberCount: ClubResponse.data.members.length,
                        description: ClubResponse.data.description,
                        lastUpdated: `${Date.now()}`
                    },
                    history: SortedHistory
                });

                ClubLogData.save();
            } else {
                History.push(...OldClubLogData[0].history);
                function compareNumbers(a, b) {
                    return b.timestamp - a.timestamp;
                };
                const SortedHistory = History.sort(compareNumbers);

                await ClubLogs.findOneAndUpdate({
                    _id: OldClubLogData[0]._id
                }, {
                    club: {
                        tag: ClubResponse.data.tag,
                        name: ClubResponse.data.name,
                        trophies: ClubResponse.data.trophies,
                        requiredTrophies: ClubResponse.data.trophies,
                        memberCount: ClubResponse.data.members.length,
                        description: ClubResponse.data.description,
                        lastUpdated: `${Date.now()}`
                    },
                    history: SortedHistory
                });
            };
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
})();

setInterval( async () => {
    await StartWorkers();
}, 5 * 60 * 1000);