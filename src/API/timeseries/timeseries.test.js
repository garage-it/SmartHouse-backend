import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import app from '../../index';

describe('## Timeseries API', () => {

    beforeEach((done)=>{
        done()
    });

    it('should be available and give error by default', (done) => {
        request(app)
        .get("/api/timeseries")
        .expect(httpStatus.BAD_REQUEST)
        .then(() => {
            done()
         });
    });

    it('should give error by default', (done) => {
        request(app)
        .get("/api/timeseries?period=day&sensor=SENSOR")
        .expect(httpStatus.OK)
        .then(() => {
            done()
         });
    });

    it('should return from, to, sensor, stepMin, data fields', (done) => {
      request(app)
      .get("/api/timeseries?period=day&sensor=SENSOR")
      .expect(httpStatus.OK)
      .then((res) => {
          expect(res.body.from).to.exist;
          expect(res.body.to).to.exist;
          expect(res.body.sensor).to.exist;
          expect(res.body.stepMin).to.exist;
          expect(res.body.data).to.exist;
          done();
       });
    });

    it('should accept data interval day & return step 60min', (done) => {
      request(app)
      .get("/api/timeseries?period=day&sensor=SENSOR")
      .expect(httpStatus.OK)
      .then((res) => {
          expect(res.body.stepMin).to.equal(60);
          done();
       });
    });

    it('should accept data interval week & return step 60min', (done) => {
      request(app)
      .get("/api/timeseries?period=week&sensor=SENSOR")
      .expect(httpStatus.OK)
      .then((res) => {
          expect(res.body.stepMin).to.equal(60);
          done();
       });
    });

    it('should accept data interval month & return step 60min', (done) => {
      request(app)
      .get("/api/timeseries?period=month&sensor=SENSOR")
      .expect(httpStatus.OK)
      .then((res) => {
          expect(res.body.stepMin).to.equal(60*24);
          done();
       });
    });

    it('should accept year interval week & return step 60min', (done) => {
      request(app)
      .get("/api/timeseries?period=year&sensor=SENSOR")
      .expect(httpStatus.OK)
      .then((res) => {
          expect(res.body.stepMin).to.equal(60*24);
          done();
       });
    });

});
