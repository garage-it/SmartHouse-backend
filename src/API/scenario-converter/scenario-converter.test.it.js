import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import app from '../../index';

describe('## scenario-converter APIs', () => {
    const SCENARIO = {
        conditions: [{device: 'any', condition: 'LESS_THAN_OR_EQUAL_TO', value: '123'}],
        actions: [{device: 'air-conditioner', value: 'ON'}]
    };

    const SCENARIO_QUERY = 'conditions%5B0%5D%5Bdevice%5D=any&conditions%5B0%5D%5Bcondition%5D=LESS_THAN_OR_EQUAL_TO&conditions%5B0%5D%5Bvalue%5D=123&actions%5B0%5D%5Bdevice%5D=air-conditioner&actions%5B0%5D%5Bvalue%5D=ON';

    const BAD_REQUEST = 'Bad Request';

    describe('# GET /api/scenario-converter', () => {
        it('will return string on correct JSON send', (done) => {
            request(app)
                .get(`/api/scenario-converter?${ SCENARIO_QUERY }`)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.text).to.include(SCENARIO.conditions[0].device);
                    expect(res.text).to.include(SCENARIO.actions[0].device);
                    done();
                });
        });

        it('will return Bad Request on JSON NOT send', (done) => {
            request(app)
                .get('/api/scenario-converter?')
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.text).to.include(BAD_REQUEST);
                    done();
                });
        });
    });
});
