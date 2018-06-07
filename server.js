const express = require('express');
const app = express();
// const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { League, Round } = require('./models');

// TODO: how to integrate CLIENT_ORIGIN with other configs (see config.js)? Also, delete const PORT below since it will presumably be in config
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

app.get('/api/*', (req, res) => {
    res.json({ok: true})
});

// TODO: these paths don't need to match front-end paths do they? They currently don't except for /dashboard

// GET active leagues
app.get('/dashboard', (req, res) => {
    
});
// POST new league
app.post('/league', (req, res) => {
    
});
// GET active league by id
// TODO: This also includes things like getting completed rounds, players, etc. I don't also need separate endpoints for these, right?
app.get('/league/:id', (req, res) => {
    
});
// POST new round
app.post('/round', (req, res) => {
    
});
// PUT round points
app.put('./round/id:', (req, res) => {

});

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

let server;

// function runServer() {
// 	const port = PORT;
// 	return new Promise((resolve, reject) => {
// 		server = app.listen(port, () => {
// 			console.log(`App is listening on port ${port}`);
// 			resolve(server);
// 		})
// 			.on('error', err => {
// 				reject(err);
// 		});
// 	});
// }

// function closeServer() {
// 	return new Promise((resolve, reject) => {
// 		console.log('closing server');
// 		server.close(err => {
// 			if (err) {
// 				reject(err);
// 				return;
// 			}
// 			resolve();
// 		});
// 	});
// }

// if (require.main === module) {
//     runServer().catch(err => console.log(err));
// }

// module.exports = { app }
