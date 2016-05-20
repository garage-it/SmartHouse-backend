import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';
import {seedData} from '../../config/seed';

chai.config.includeStack = true;

describe('## scenario APIs', () => {

    describe('# GET /api/scenarios/:scenarioId', () => {
        it('should get scenario details', (done) => {
            request(app)
                .get(`/api/scenarios/${seedData.scenarios[0].id}`)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.deep.equal(seedData.scenarios[0]);
                    done();
                });
        });
    });

    describe('# GET /api/scenarios/', () => {
        it('should get all scenarios', (done) => {
            request(app)
                .get('/api/scenarios')
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.deep.equal(seedData.scenarios);
                    done();
                });
        });
    });

    describe('# PUT /api/scenarios/:id', () => {
        it('should update scenario', (done) => {
            const originalScenario = seedData.scenarios[0],
                modifiedScenario = Object.assign({}, originalScenario, {description: 'new description'});
            request(app)
                .put(`/api/scenarios/${originalScenario.id}`)
                .send(modifiedScenario)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.deep.equal(modifiedScenario);
                    done();
                });
        });
    });

    describe('# POST /api/scenarios', () => {
        it('should update scenario', (done) => {
            const scenario = Object.assign({}, seedData.scenarios[0]);
            delete scenario.id;
            request(app)
                .post('/api/scenarios')
                .send(scenario)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.contain(scenario);
                    done();
                });
        });
    });


});
