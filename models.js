const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSchema = Schema({
    name: {
        type: String,
        required: true
    },
    players: [String],
    // players: [{ 
    //     type: Schema.Types.ObjectId, 
    //     ref: 'Player'
    // }],
    endDate: {
        type: Date,
        default: Date.now
    },
    pointTypes: [String],
    // rounds: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Round'
    // }]
});

const playerSchema = Schema({
    name: {
        type: String,
        required: true
    }
});
const roundSchema = Schema({
    name: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    players: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Player'
    }]
});
const pointWeightSchema = Schema({
    league: { 
        type: Schema.Types.ObjectId, 
        ref: 'League'
    },
    type: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
});
const pointAllocationSchema = Schema({
    league: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'League'
    }],
    players: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Player'
    }],    
    round: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Round'
    }],
    counts: {
        // TODO: if this doesn't work use String type w/getter and setter: https://stackoverflow.com/questions/17497875/storing-json-object-in-mongoose-string-key
        type: Object
        // label: count,
        // label: count,
    },
    total: {
        type: Number
    }
    //TODO: add addEntry and computeTotal
});

const League = mongoose.model('League', leagueSchema);
const Round = mongoose.model('Round', roundSchema);
const Player = mongoose.model('Player', playerSchema);
const PointWeight = mongoose.model('PointsWeight', pointWeightSchema);
const PointAllocation = mongoose.model('PointsAllocation', pointAllocationSchema);

// leagueSchema.methods.serialize = function() {
//     return {
//         id: this._id,
//         leagueName: this.leagueName,
//         endDate: this.endDate,
//         players: this.players,
//         pointsSettings: this.pointsSettings
//     }
// }

module.exports = { League, Round, Player, PointWeight, PointAllocation }