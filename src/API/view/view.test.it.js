import request from 'supertest-as-promised';
import { OK } from 'http-status';
import app from '../../index';

describe('# GET /view', () => {

    it('should return array of view objects', done => {
        request(app)
            .get('/api/view')
            .expect(OK)
            .then(res => {
                expect(res.body).to.be.a('array');                
                done();
            })
            .catch(done);
    });
})
