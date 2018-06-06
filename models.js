const mongoose = require('mongoose');

const leagueSchema = mongoose.Schema({
    leagueName: {
        type: String,
        required: true
    },
    endDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    players: {
        // TODO: Which one of these is correct (name or type) and do I also need to store player points here? Also update player below
        name: [String],
        // type: Array,
        required: true
    },
    // TODO: should I just hard-code points for now?
    pointsSettings: [{
        firstPlace: Number,
        secondPlace: Number,
        ltEagle: Number,
        eagle: Number,
        birdie: Number,
        par: Number,
        gtBogey: Number,
        mulligan: Number,
        holeNotFinished: Number
    }]
});

leagueSchema.methods.serialize = function() {
    return {
        id: this._id,
        leagueName: this.leagueName,
        endDate: this.endDate,
        players: this.players,
        pointsSettings: this.pointsSettings
    }
}

// TODO: Should round be it's own schema or part of league?
const roundSchema = mongoose.Schema({
    leagueName: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    players: {
        // TODO: Which one of these is correct (name or type) and do I also need to store player points here?
        name: [String],
        // type: Array,
        required: true
    }
});

// TODO: is serialize only necessary because I'm including the ID from Mongo?
roundSchema.methods.serialize = function() {
    return {
        id: this._id,
        eventName: this.eventName,
        courseName: this.courseName,
        date: this.date,
        players: this.players
    }
}


const League = mongoose.model('League', leagueSchema);
const Round = mongoose.model('Round', roundSchema);

module.exports = { League, Rounds }