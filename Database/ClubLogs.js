const Mongoose = require('mongoose');

const ClubLogsModel = new Mongoose.Schema({
    club: {
        tag: { required: true, type: String },
        name: { required: true, type: String },
        trophies: { required: true, type: Number },
        requiredTrophies: { required: true, type: Number },
        memberCount: { required: true, type: Number }, 
        description: { required: true, type: String }, 
        lastUpdated: { required: true, type: String },
    },
    history: [
        {
            type: { required: true, type: String },
            data: { required: true, type: Object },
            timestamp: { required: true, type: String }
        }
    ]
});

const ClubLogs = Mongoose.model('ClubLogs', ClubLogsModel);

module.exports = ClubLogs;