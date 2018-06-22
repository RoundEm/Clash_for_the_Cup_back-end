const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const mongoose = require('mongoose');

const { League, Round, Player, PointWeight, PointAllocation } = require('./models');

const { CLIENT_ORIGIN, DB_URL, PORT } = require('./config');

mongoose.connect(DB_URL);

if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('common'));
}   

app.use(
    cors({
        origin: CLIENT_ORIGIN
	})
)

// POST new league 
app.post('/league', jsonParser, (req, res) => {
	console.log('req.body: ', req.body)
	League.create(req.body)
		.then(league => {
			res.status(201).json(league);
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// GET all leagues
app.get('/leagues', (req, res) => {
	League.find({})
		.populate('players')
		.populate('rounds')
		.populate('points')
		.then(leagues => {
			res.json(leagues);
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
})

// TODO: why are there fields for both id and _id on returned json?
// GET league
app.get('/leagues/:id', (req, res) => {
	League.findById(req.params.id)
		.populate('players')
		.populate('rounds')
		.populate('points')
		.then(league => {
			res.json(league)
		})
		.catch(err => {
			console.log(err)
			res.status(400).json(err);
		});
});

// UPDATE league
app.put('/leagues/:id', jsonParser, (req, res) => {
	// console.log('req.body: ', req.body)
	League.findByIdAndUpdate(req.params.id, { $set: req.body }, { "new": true })
		.then(league => {
			res.status(204).json(league)
		})
		.catch(err => {
			console.log(err)
			res.status(400).json(err);
		});
});

// POST point weighting
app.post('/leagues/:id/point-weighting', jsonParser, (req, res) => {
	console.log('POST point weight req.body: ',res.body)
	const data = {
		league: req.params.id,
		type: req.body.type,
		weight: req.body.weight
	}
	PointWeight.create(data)
		.then(pointType => {
			res.json(pointType)
		})
		.catch(err => {
			console.log(err)
			res.status(400).json(err);
		});
});

// GET point weightings
app.get('/leagues/:id/point-weighting', (req, res) => {
	PointWeight.find({league: req.params.id})
		.then(points => {
			res.json(points)
		})
		.catch(err => {
			console.log(err)
			res.status(400).json(err);
		});
});

// PUT point weighting
app.put('/leagues/:id/point-weighting', jsonParser, (req, res) => {
	const data = {
		league: req.params.id,
		type: req.body.type,
		weight: req.body.weight
	}
	PointWeight.update({type: req.body.type}, { $set: data }, { "new": true })
		.then(pointType => {
			res.status(204).json(pointType);
		})
		.catch(err => {
			console.log(err);
			res.status(400).json(err);
		});
});

// POST league players
app.post('/leagues/:id/players', jsonParser, (req, res) => {
	console.log('POST players req.body: ', req.body)
	const data = {
		name: req.body.name,
		league: req.params.id
	}
	Player.create(data)
		.then(players => {
			res.status(201).json(players);
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// GET league players
app.get('/leagues/:id/players', (req, res) => {
	Player.find({league: req.params.id})
		.then(players => {
			console.log(players)
			res.json(players)
		})
		.catch(err => {
			console.log(err);
			res.status(400).json(err);
		});
});

// DELETE league players (Probably implement later)
// app.delete('/leagues/:id/remove-player/:playerId', (req, res) => {
// 	Player.findByIdAndRemove(req.params.playerId)
// 		.then(players => {
// 			res.status(204).send('Player deleted');
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 			res.status(400).json(err);
// 		});
// });

// POST new round
app.post('/leagues/:id/round', jsonParser, (req, res) => {
	// console.log('POST round req.body:', req.body)
    Round.create(req.body)
		.then(round => {
			res.status(201).json(round);
		})
		.catch(err => {
			console.log(err);
			res.status(400).json(err);
		});
});

// GET round
app.get('/leagues/:id/round/:roundId', (req, res) => {
	console.log('req.body: ', req.body)
	Round.findById(req.params.roundId)
		.populate('totalPoints')
		.then(round => {
			console.log('GET round: ', round)
			res.json(round);
		})
		.catch(err => {
			console.log(err);
			res.status(400).json(err);
		});
});

// UPDATE round TODO: do i need this?
app.put('/leagues/:id/round/:roundId', jsonParser, (req, res) => {
	// console.log('req.body: ', req.body)
	Round.findByIdAndUpdate(req.params.roundId, { $set: req.body }, { "new": true })
		.then(round => {
			res.status(204).json(round);
		})
		.catch(err => {
			console.log(err)
			res.status(400).json(err);
		});
});

// POST points allocation
app.post('/leagues/:id/:roundId/points-allocation/:playerId', jsonParser, (req, res) => {
	console.log('post points req.body.total: ', req.body)
	PointAllocation.update(
		{
			round: req.params.roundId,
			league: req.params.id,
			player: req.params.playerId,
		},
		{
			league: req.params.id,
			round: req.params.roundId,
			player: req.params.playerId,
			total: req.body.total
		},
		{
			upsert: true
		})
		.then(roundPoints => {
			console.log('roundPoints: ', roundPoints)
			res.status(201).json(roundPoints);
		})
		.catch(err => {
			console.log(err)
			res.status(400).json(err);
		});
});

// GET points allocation for each player
// app.get('/leagues/:id/points-allocation/:playerId', (req, res) => {
// 	PointAllocation.find({player: req.params.playerId})
// 		.then(points => {
// 			res.json(points);
// 		})
// 		.catch(err => {
// 			console.log(err)
// 			res.status(400).json(err);
// 		});
// });

// GET points for all players in a round
app.get('/leagues/:id/:roundId/points-allocation', (req, res) => {
	PointAllocation.find({round: req.params.roundId})
		.then(allRoundPoints => {
			res.json(allRoundPoints);
		})
		.catch(err => {
			console.log(err)
			res.status(400).json(err);
		});
});

// GET points allocation for all player in all rounds
app.get('/leagues/:id/points-allocation', (req, res) => {
	PointAllocation.find({league: req.params.id})
		.then(allLeaguePoints => {
			res.json(allLeaguePoints);
		})
		.catch(err => {
			console.log(err)
			res.status(400).json(err);
		});
});

// PUT points allocation
app.put('/leagues/:id/:roundId/points-allocation/:playerId', jsonParser, (req, res) => {

});

// If time permits:
// DELETE round
// DELETE points weighting
// DELETE points allocation

// No endpoint hit
app.use((req, res) => {
    res.sendStatus(404);
});

let server;

function runServer() {
	return new Promise((resolve, reject) => {
		server = app.listen(PORT, () => {
			console.log(`App is listening on port ${PORT}`);
			resolve(server);
		})
		.on('error', err => {
			reject(err);
		});
	});
}

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('closing server');
		server.close(err => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
}

if (require.main === module) {
    runServer().catch(err => console.log(err));
}

module.exports = { app, runServer, closeServer }
