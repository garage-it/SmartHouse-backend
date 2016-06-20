import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('## scenario-converter APIs', () => {
    const SCENARIO_JSON = {
        conditions: [{device: 'light', condition: 'GREATER_THAN', value: 5}],
        actions: [{device: 'air-conditioner', value: 'ON'}],
        logicalOperator: ''
    };

    describe('# GET /api/scenario-converter', () => {
        it('will return string on correct JSON send', (done) => {
            request(app)
                .get(`/api/scenario-converter?scenarioConfig=${JSON.stringify(SCENARIO_JSON)}`)
                .expect(httpStatus.OK);

            done();
        });

        it('will return Bad Request on JSON NOT send', (done) => {
            request(app)
                .get('/api/scenario-converter?scenarioConfig=')
                .expect(httpStatus.BAD_REQUEST);

            done();
        });

        it('will return Bad Request on incorrect JSON send', (done) => {
            request(app)
                .get('/api/scenario-converter?scenarioConfig={}')
                .expect(httpStatus.BAD_REQUEST);

            done();
        });
    });
});
