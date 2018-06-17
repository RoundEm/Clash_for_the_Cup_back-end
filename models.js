const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    endDate: {
        type: Date,
    },
    pointTypes: [String],
    // rounds: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Round'
    // }]
}, { toJSON: { virtuals: true } });

leagueSchema.virtual('players', {
    ref: 'Player',
    localField: '_id',
    foreignField: 'league'
});

leagueSchema.virtual('rounds', {
    ref: 'Round',
    localField: '_id',
    foreignField: 'league'
});

const playerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    league: {
        type: Schema.Types.ObjectId,
        ref: 'League'
    }
});

// TODO: does this need to have a reference to league? How do players tie in?
const roundSchema = Schema({
    league: {
        type: Schema.Types.ObjectId,
        ref: 'League'
    },
    name: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    // players: [{ 
    //     type: Schema.Types.ObjectId, 
    //     ref: 'Player'
    // }]
    players: [String]
});


const pointWeightSchema = Schema({
    league: { 
        type: Schema.Types.ObjectId, 
        ref: 'League'
    },
    // pointDef: [{
    //     type: String,
    //     weight: Number
    // }]
    type: {
        type: String,
        required: true
    },
    weight: {
        type: Number
    }
});

const pointAllocationSchema = Schema({
    league: { 
        type: Schema.Types.ObjectId, 
        ref: 'League'
    },
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
const PointWeight = mongoose.model('PointWeight', pointWeightSchema);
const PointAllocation = mongoose.model('PointAllocation', pointAllocationSchema);

module.exports = { League, Round, Player, PointWeight, PointAllocation }