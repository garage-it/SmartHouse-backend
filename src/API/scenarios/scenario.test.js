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
                .get(`/api/scenarios/${seedData.scenarios[0]._id}`)
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

});
