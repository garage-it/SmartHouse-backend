import request from 'supertest-as-promised';
import { OK } from 'http-status';
import app from '../../index';
import ViewModel from './view.model';

describe('# GET /view', () => {

    beforeEach((done) => {
        ViewModel
          .create({})
          .finally(done);
    });

    it('should return array of view objects', done => {
        request(app)
            .get('/api/view')
            .expect(OK)
            .then(res => {
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf(1);
                done();
            })
            .catch(done);
    });
})
