const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const {app, runServer, closeServer} = require('../server');
const { League, Round, Player, PointWeight, PointAllocation } = require('../models');

const expect = chai.expect;
chai.use(chaiHttp);

function generateLeagueData() {
    return {
        name: faker.lorem.word(),
        endDate: faker.date.future()
    }
}
async function seedLeagueData() {
    const seedData = [];
    for (let i = 0; i < 5; i++) {
        seedData.push(generateLeagueData());
    }
    return await League.insertMany(seedData)
}

function generatePlayerData(league) {
    return {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        league: league._id
    }
}
async function seedPlayerData(league) {
    const seedData = [];
    for (let i = 0; i < 5; i++) {
        seedData.push(generatePlayerData(league));
    }
    return await Player.insertMany(seedData)
}

function generateRoundData(league, player) {
    return {
        league: league._id,
        name: faker.lorem.words(),
        course: faker.lorem.words(),
        date: faker.date.future(),
        players: [player._id]
    }
}
async function seedRoundData(league, player) {
    const seedData = [];
    for (let i = 0; i < 5; i++) {
        seedData.push(generateRoundData(league, player));
    }
    return await Round.insertMany(seedData)
}

function generatePointWeightData(league) {
    return {
        league: league._id,
        type: faker.lorem.word(),
        weight: faker.random.number()
    }
}
async function seedPointWeightData(league) {
    const seedData = [];
    for (let i = 0; i < 5; i++) {
        seedData.push(generatePointWeightData(league));
    }
    return await PointWeight.insertMany(seedData)
}


function tearDownDb() {
    return mongoose.connection.dropDatabase();
}

async function initSeedData() {
    const leagues = await seedLeagueData();
    leagues.forEach(async league => {
        await seedPointWeightData(league);
        const players = await seedPlayerData(league);
        players.forEach(async player => {
            await seedRoundData(league, player);
        })
    })
}

describe('App API', function() {
    before(() => {
        return runServer();
    });
    beforeEach(() => {
        return initSeedData();
    });
    afterEach(() => {
        return tearDownDb();
    });
    after(() => {
        return closeServer();
    });

    describe('POST new league endpoint', function() {
        it('should add a new league', function() {
            const newLeague = {
                name: 'The Tour',
                endDate: '10/1/2018',
            }
            return chai.request(app)
                .post('/league')
                .send(newLeague)
                .then(function(res) {
                    console.log('POST res')
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        '_id', 'name', 'endDate'
                    );
                    expect(res.body.name).to.equal(newLeague.name);
                    expect(res.body._id).to.not.be.null;
                });
        });
    }); 

    describe('GET leagues endpoint', function() {
        it('should return all leagues', function() {
            let res;
            return chai.request(app)
                .get('/leagues')
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return League.count()
                })
                .then(function(count) {
                    expect(res.body).to.have.lengthOf(count);
                });
        });

        it('should return leagues with the correct fields', function() {
            let resLeague;
            return chai.request(app)
                .get('/leagues')
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf.at.least(1);
                    res.body.forEach(function(league) {
                        expect(league).to.be.a('object');
                        expect(league).to.include.keys('_id', 'name', 'players', 'rounds', 'points')
                    });
                    resLeague = res.body[0];
                    return League.findById(resLeague.id);
                })
                .then(function(league) {
                    expect(resLeague.id).to.equal(league.id);
                    expect(resLeague.name).to.equal(league.name);
                    expect(resLeague.players)
                });
        });
    });

    describe('GET league by id endpoint', function() {
        it('Should return a league by id', function() {
            return chai.request(app)
                .get('/leagues')
                .then(function(res) {
                    return chai.request(app)
                        .get(`/leagues/${res.body[0]._id}`)
                        .then(function(res) {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.be.a('object');
                            expect(res.body).to.include.keys('_id', 'name', 'players', 'rounds', 'points');
                            expect(res.body.players).to.be.a('array')
                        });
                });
        });
    });

    describe('DELETE league endpoint', function() {
        it('Should delete a league by id', function() {
            return chai.request(app)
                .get('/leagues')
                .then(function(res) {
                    return chai.request(app)
                        .delete(`/leagues/${res.body[0]._id}`)
                        .then(function(res) {
                            expect(res).to.have.status(204);
                        });
                });
        });
    });

    describe('POST players endpoint', function() {
        it('should create a new player', function() {
            const newPlayer = {
                name: 'Rand Al-Thor',
            }
            return League
                .findOne()
                .then(function(league) {
                    const leagueId = league._id;
                    return chai.request(app)
                        .post(`/leagues/${leagueId}/players`)
                        .send(newPlayer)
                        .then(function(res) {
                            expect(res).to.have.status(201);
                            expect(res).to.be.json;
                            expect(res.body).to.be.a('object');
                            expect(res.body).to.include.keys('_id', 'name');
                        });
                });
        });
    });

    describe('GET players endpoint', function() {
        it('should return all players in a league', function() {
            return chai.request(app)
                .get('/leagues')
                .then(function(res) {
                    const leagueId = res.body[0]._id;
                    expect(leagueId).to.be.a('string');
                    return chai.request(app)
                        .get(`/leagues/${leagueId}/players`)
                        .then(function(res) {
                            console.log('GETPlayers: ', res.body)
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.be.a('array');
                            res.body.forEach(function(player) {
                                expect(player).to.include.keys('_id', 'name', 'league');
                            });
                            return Player.where({league: leagueId})
                        })
                        .then(function(count) {
                            expect(res.body).to.have.lengthOf(count.length);
                        });
               });
        });
    });

    describe('POST point definition endpoint', function() {
        it('Should post a new point definition', function() {
            const newPointDef = {
                type: 'Throwing Club',
                weight: -10
            }
            return PointWeight
                .findOne()
                .then(function(pointDef) {
                    const id = pointDef._id;
                    return chai.request(app)
                        .post(`/leagues/${id}/point-weighting`)
                        .send(newPointDef)
                        .then(function(res) {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.be.a('object');
                            expect(res.body).to.include.keys('_id', 'type', 'weight');
                        })
                })
        });
    });

    describe('GET point definitions endpoint', function() {
        it('Should return all point definitions in a league', function() {
            return chai.request(app)
                .get('/leagues')
                .then(function(res) {
                    return chai.request(app)
                        .get(`/leagues/${res.body[0]._id}/point-weighting`)
                        .then(function(res) {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.be.a('array');
                            res.body.forEach(function(pointDef) {
                                expect(pointDef).to.include.keys('_id', 'type', 'weight');
                            });
                        });
                });
        });
    });
 
    describe('POST round endpoint', function() {
        it('should create a new round', function() {
            const newRound = {
                name: 'Manetheren Classic',
                course: 'Emonds Field Country Club',
                date: '4/15/2018'
            }
            return League
                .findOne()
                .then(function(league) {
                    const id = league._id;
                    return chai.request(app)
                        .post(`/leagues/${id}/round`)
                        .send(newRound)
                        .then(function(res) {
                            expect(res).to.have.status(201);
                            expect(res).to.be.json;
                            expect(res.body).to.be.a('object');
                            expect(res.body).to.include.keys('_id', 'name', 'course', 'date');
                            return Round.findById(res.body._id);
                        })
                        .then(function(round) {
                            expect(round.name).to.equal(newRound.name);
                            expect(round.course).to.equal(newRound.course);
                        });
                });
        });
    });

    // TODO: Rounds are seeded but not being returned with response?
    // describe('GET round endpoint', function() {
    //     it('should return an existing round by id', function() {
    //         return chai.request(app)
    //             .get('/leagues')
    //             .then(function(res) {
    //                 console.log('RES BODY: ', res.body)
    //                 const league = res.body[0];
    //                 console.log('rounds: ', res.body.rounds)
    //                 const roundId = league.rounds[0]._id;
    //                 return chai.request(app)
    //                     .get(`/leagues/${league_id}/round/${roundId}`)
    //                     .then(function(round) {
    //                             expect(res).to.have.status(200);
    //                             expect(res).to.be.json;
    //                             expect(res).to.be.a('object');
    //                             expect(res.body).to.include.keys('_id', 'name', 'course', 'date', 'players');
    //                             expect(res.body.players).to.be.a('array');
    //                     });
    //             });
    //     });
    // });

});
