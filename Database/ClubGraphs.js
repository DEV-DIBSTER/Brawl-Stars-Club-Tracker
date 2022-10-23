const Mongoose = require('mongoose');

const LabelsSchema = new Mongoose.Schema({
    type: String
});

const DataSchema = new Mongoose.Schema({
    type: String
});

const TimeSchema = new Mongoose.Schema({
    type: String
});

const ClubGraphsModel = new Mongoose.Schema({
    clubTag: { type: String, required: true },
    timeSaved: { type: String, requied: true },
    number: {
        daily: { required: true, type: Number },
        weekly: { required: true, type: Number },
        seasonal: { required: true, type: Number }
    },
    labels: [LabelsSchema],
    data: [DataSchema],
    time: [TimeSchema]
});

const ClubGraphs = Mongoose.model('ClubGraphs', ClubGraphsModel);

module.exports = ClubGraphs;