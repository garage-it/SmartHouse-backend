import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import app from '../../index';
import timeSeriesService from './timeseries.service';
import input from '../../data-streams/input';


describe('## Timeseries API', () => {

    beforeEach((done)=>{
        timeSeriesService.saveStatisticToDB();
        input.write({ device: 'SENSOR', value: 50, event: 'status' });
        done();

    });

    it('should be available and give error by default', (done) => {
        request(app)
        .get("/api/timeseries")
        .expect(httpStatus.BAD_REQUEST)
        .then(() => {
            done()
         });
    });

    it('should return responce with 200 status when all data is provided', (done) => {
        request(app)
        .get("/api/timeseries?period=day&sensor=SENSOR")
        .expect(httpStatus.OK)
        .then(() => {
            done()
         });
    });

    it('should return sensor data fields', (done) => {
      request(app)
      .get("/api/timeseries?period=day&sensor=SENSOR")
      .expect(httpStatus.OK)
      .then((res) => {
          expect(res.body.sensor).to.exist;
          expect(res.body.data).to.exist;
          done();
       });
    });

    it('should return sensor', (done) => {
      request(app)
      .get("/api/timeseries?period=day&sensor=SENSOR")
      .expect(httpStatus.OK)
      .then((res) => {
          expect(res.body.sensor).to.equal('SENSOR');
          done();
       });
    });
});
