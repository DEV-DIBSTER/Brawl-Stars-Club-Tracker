const Mongoose = require('mongoose');

const ClubGraphsModel = new Mongoose.Schema({
    clubTag: { type: String, required: true },
    timeSaved: { type: String, requied: true },
    number: {
        daily: { required: true, type: Number },
        weekly: { required: true, type: Number },
        seasonal: { required: true, type: Number }
    },
    labels: [],
    data: [],
    time: []
});

const ClubGraphs = Mongoose.model('ClubGraphs', ClubGraphsModel);

module.exports = ClubGraphs;