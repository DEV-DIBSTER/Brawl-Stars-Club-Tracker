const Mongoose = require('mongoose');

const ClubTrackingModel = new Mongoose.Schema({
    clubTag: { required: true, type: String },
    timeSaved: { required: true, type: String },
    isTrackingLogs: { required: true, type: Boolean },
    isTrackingGraphs: { required: true, type: Boolean },
});

const ClubTracking = Mongoose.model('ClubTracking', ClubTrackingModel);

module.exports = ClubTracking;