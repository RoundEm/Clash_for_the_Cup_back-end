const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    endDate: {
        type: Date
    }
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

leagueSchema.virtual('points', {
    ref: 'PointWeight',
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

const roundSchema = new Schema({
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
        required: true
    },
    players: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Player'
    }]
});

const pointWeightSchema = new Schema({
    league: { 
        type: Schema.Types.ObjectId, 
        ref: 'League'
    },
    type: {
        type: String,
        required: true
    },
    weight: {
        type: Number
    }
});

const pointAllocationSchema = new Schema({
    league: { 
        type: Schema.Types.ObjectId, 
        ref: 'League'
    },
    player: { 
        type: Schema.Types.ObjectId, 
        ref: 'Player'
    },    
    round: { 
        type: Schema.Types.ObjectId, 
        ref: 'Round'
    },
    total: Number
});

const League = mongoose.model('League', leagueSchema);
const Round = mongoose.model('Round', roundSchema);
const Player = mongoose.model('Player', playerSchema);
const PointWeight = mongoose.model('PointWeight', pointWeightSchema);
const PointAllocation = mongoose.model('PointAllocation', pointAllocationSchema);

module.exports = { League, Round, Player, PointWeight, PointAllocation }


// counts: {
    //     TODO: if this doesn't work use String type w/getter and setter: https://stackoverflow.com/questions/17497875/storing-json-object-in-mongoose-string-key
    //     type: Object
    //     label: count,
    //     label: count,
    // },
    // TODO: add addEntry and computeTotal

    // , { toObject: { transform: function(doc, ret) {
//     ret.totalPoints = doc.getTotalPoints();
//     return ret;
// } }});

// EXAMPLE: AnimalSchema.methods.findSimilarType = function findSimilarType (cb) {
//  return this.model('Animal').find({ type: this.type }, cb);
// };

// roundSchema.methods.getTotalPoints = function(cb) {
//     const PointAllocation = this.model('PointAllocation');
//     const docs = PointAllocation.find({round: this._id})
//         .then(doc => {
//             console.log('getTotalPoints doc: ', doc)
//             let total = 0;
//             doc.forEach(d => {
//                 total += d.total
//             });
//             return total;
//         })
//         .catch(err => {
//             console.log(err)
//         });
    // try {
    //     const docs = PointAllocation.find({round: this._id})
    //     if (docs.length === 0) {
    //         return 'docs length 0';
    //     }
    //     let total = 0;
    //     docs.forEach(doc => {
    //         total += doc.total
    //     });
    //     return total;   
    // } catch(e) {
    //     return 'catch block ran';
    // }
// };