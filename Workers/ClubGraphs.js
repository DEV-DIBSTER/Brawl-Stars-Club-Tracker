const ClubLogs = require('../Database/ClubLogs.js');
const ClubTracking = require('../Database/ClubTracking.js');
const ClubGraphs = require('../Database/ClubGraphs.js');
const ClubData = require('../Database/ClubData.js');

module.exports = ({
    run: async (OldData, ClubResponse) => {                
        const ClubGraphsData = await (await ClubGraphs.find()).filter(m => m.clubTag == ClubResponse.data.tag);

        if(ClubGraphsData.length == 0){
            const Today = new Date(Date.now());

            const NewClubGraphsData = new ClubGraphs({
                clubTag: ClubResponse.data.tag,
                timeSaved: Date.now().toString(),
                number: {
                    daily: 0,
                    weekly: 0,
                    seasonal: 0
                },
                labels: [`${Today.toLocaleString('en-US', {month: 'short'})} ${Today.getDate()}`],
                data: [`${ClubResponse.data.trophies}`],
                time: [`${Date.now()}`]
            });

            await NewClubGraphsData.save();
        } else if (ClubGraphsData.length == 1) {
            const OldGraphData = ClubGraphsData[0];

            //Convert 3 letter Month strings to integer values.
            function MonthValue(Month){
                if (Month == "Jan") {
                    return 1;
                } else if (Month == "Feb") {
                    return 2;
                } else if (Month == "Mar") {
                    return 3;
                } else if (Month == "Apr") {
                    return 4;
                } else if (Month == "May") {
                    return 5;
                } else if (Month == "Jun") {
                    return 6;
                } else if (Month == "Jul") {
                    return 7;
                } else if (Month == "Aug") {
                    return 8;
                } else if (Month == "Sep") {
                    return 9;
                } else if (Month == "Oct") {
                    return 10;
                } else if (Month == "Nov") {
                    return 11;
                } else if (Month == "Dec") {
                    return 12;
                };
            };

            function SortLabels(a, b) {
                return MonthValue(a.split(' ')[0]) -  MonthValue(b.split(' ')[0]);
            };

            const Today = new Date(Date.now());

            let NewLabels = OldGraphData.labels;
            let NewData = OldGraphData.data;
            let NewTime = OldGraphData.time;

            function IsSameDay(Time1, Time2) {
                const Date1 = new Date(parseInt(Time1));
                const Date2 = new Date(parseInt(Time2));
                
                // Checks the year, the month, and the date.
                return (
                    Date1.getFullYear() === Date2.getFullYear() &&
                    Date1.getMonth() === Date2.getMonth() &&
                    Date1.getDate() === Date2.getDate()
                );
            };

            if (IsSameDay(NewTime[NewTime.length - 1], `${Date.now()}`)){
                NewLabels.pop();
                NewData.pop();
                NewTime.pop(); //Removes the last element of the array.

                NewLabels.push(`${Today.toLocaleString('en-US', {month: 'short'})} ${Today.getDate()}`);
                NewData.push(`${ClubResponse.data.trophies}`);
                NewTime.push(`${Date.now()}`);
            } else {
                NewLabels.push(`${Today.toLocaleString('en-US', {month: 'short'})} ${Today.getDate()}`);
                NewData.push(`${ClubResponse.data.trophies}`);
                NewTime.push(`${Date.now()}`);
            };


            await ClubGraphs.findOneAndUpdate({
                clubTag: ClubResponse.data.tag
            }, {
                clubTag: ClubResponse.data.tag,
                timeSaved: `${Date.now()}`,
                number: {
                    daily: 0,
                    weekly: 0,
                    seasonal: 0
                },
                labels: NewLabels,
                data: NewData,
                time: NewTime
            });
        };
    },
});