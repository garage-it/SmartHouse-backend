import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('## scenario-converter APIs', () => {
    const SCENARIO_JSON = {
        conditions: [],
        actions: [],
        logicalOperator: ''
    };

    const SCENARIO_EMPTY_JS = `if (
            
        ) {
            
        }`;

    describe('# GET /api/scenario-converter', () => {
        it('should return string on correct JSON send', (done) => {
            request(app)
                .get(`/api/scenario-converter?scenarioConfig=${JSON.stringify(SCENARIO_JSON)}`)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.equal(SCENARIO_EMPTY_JS);
                    done();
                })
                .catch(done);
        });

        it('should return Bad Request on JSON not send', (done) => {
            request(app)
                .get('/api/scenario-converter?scenarioConfig=')
                .expect(httpStatus.BAD_REQUEST);

            done();
        });
    });
});
