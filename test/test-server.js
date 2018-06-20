const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const {app, runServer, closeServer} = require('../server');
const { League, Round, Player, PointWeight, PointAllocation } = require('../models');

const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect();

chai.use(chaiHttp);

function tearDownDb() {
    console.warn('Tearing down database');
    return mongoose.connection.dropDatabase();
}

describe('App API', function() {
    before(() => {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(() => {
        return seedData();
    });
    afterEach(() => {
        return tearDownDb();
    });
    after(() => {
        return closeServer();
    });

    describe('POST new league endpoint', function() {
        it('should add a new league', function() {
            // TODO: complete newLeague
            const newLeague = {
                name: 'The Tour',
                endDate: '10/1/2018',
                pointTypes: ['First', 'Second', 'Birdie']
            }
            return chai.request(app)
                .post('/league')
                .send(newLeague)
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        '_id', 'name', 'endDate', 'pointTypes'
                    );
                    expect(res.body.pointTypes).to.be.a('array');
                    expect(res.body.name).to.equal(newLeague.name);
                });
        });
    }); 

    describe('PUT league endpoint', function() {
        it('should update fields', function() {
            const updatedData = {
                name: 'Robot League',
                endDate: '9/30/2118',
                pointTypes: ['bleep', 'bloop', 'bizzz']
            }
            return League
                .findOne()
                .then(function(league) {
                    updatedData.id = league._id;
                    return chai.request(app)
                        .put(`leagues/${league.id}`)
                        .send(updatedData)
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return League.findById(updatedData.id)
                })
                .then(function(res) {
                    expect(league.name).to.equal(updatedData.name);
                    expect(league.endDate).to.equal(updatedData.endDate);
                    expect(league.pointTypes).to.include(updatedData.pointTypes);
                });
        });
    }); 

    describe('GET league endpoint', function() {
        it('should return a league', function() {
           
        })
    })

    describe('DELETE players endpoint', function() {
        it('should delete a player', function() {
           
        })
    })

});
