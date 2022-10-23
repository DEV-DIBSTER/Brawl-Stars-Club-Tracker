const Mongoose = require('mongoose');

const ClubDataModel = new Mongoose.Schema({
    clubTag: { type: String, required: true },
    timeSaved: { type: String, requied: true },
    data: { type: Object, required: true }
});

const ClubData = Mongoose.model('ClubData', ClubDataModel);

module.exports = ClubData;