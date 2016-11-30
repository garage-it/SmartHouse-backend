import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import app from '../../index';

describe('## Switcher Statistics API', () => {
    const BASE_URL = '/api/switcher-statistics?';
    const FULL_URL = `${BASE_URL}period=day&sensor=SENSOR`;

    beforeEach((done)=>{
        done();
    });

    it('should be available and give error by default', (done) => {
        request(app)
            .get(BASE_URL)
            .expect(httpStatus.BAD_REQUEST)
            .then(() => {
                done();
             });
    });

    it('should return responce with 200 status when all data is provided', (done) => {
        request(app)
            .get(FULL_URL)
            .expect(httpStatus.OK)
            .then(() => {
                done();
             });
    });

    it('should return array with two elements', (done) => {
        request(app)
            .get(FULL_URL)
            .expect(httpStatus.OK)
            .then(({body}) => {
                expect(body.data.length).to.equal(2);
                done();
            });
    });

    it('should return statistics for Time ON', (done) => {
        request(app)
            .get(FULL_URL)
            .expect(httpStatus.OK)
            .then(({body}) => {
                expect(body.data[0].name).to.equal('Time ON');
                expect(body.data[0].value).to.be.a('number');
                done();
            });
    });

    it('should return statistics for Time OFF', (done) => {
        request(app)
            .get(FULL_URL)
            .expect(httpStatus.OK)
            .then(({body}) => {
                expect(body.data[1].name).to.equal('Time OFF');
                expect(body.data[1].value).to.be.a('number');
                done();
            });
    });

});
