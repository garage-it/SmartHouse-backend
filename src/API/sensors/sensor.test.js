import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('## Sensor APIs', () => {
    let sensor = {
        description: 'desc',
        type: 'some type',
        mqttId: 'some mqtt id'
    };

    describe('# POST /api/sensors', () => {

        it('should create a new sensor', (done) => {
            request(app)
                .post('/api/sensors')
                .send(sensor)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.contain(sensor);
                    sensor = res.body;
                    done();
                });
        });

        it('should not create a new sensor with existing mqtt id', (done) => {
            request(app)
                .post('/api/sensors')
                .send(sensor)
                .then(res => {
                    expect(res.status).to.be.above(400);
                    done();
                });
        });

        it('should not create a new sensor without mqtt id', (done) => {
            const invalidSensor = {};

            request(app)
                .post('/api/sensors')
                .send(invalidSensor)
                .then(res => {
                    expect(res.status).to.be.above(400);
                    done();
                });
        });

    });

    describe('# GET /api/sensors/:sensorId', () => {
        it('should get sensor details', (done) => {
            request(app)
                .get(`/api/sensors/${sensor._id}`)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.contain(sensor);
                    done();
                });
        });

        it('should report error with message - Not found, when sensor does not exists', (done) => {
            request(app)
                .get('/api/sensors/56c787ccc67fc16ccc1a5e92')
                .expect(httpStatus.NOT_FOUND)
                .then(res => {
                    expect(res.body.message).to.equal('Not Found');
                    done();
                });
        });
    });

    describe('# PUT /api/sensors/:sensorId', () => {
        it('should update sensor details', (done) => {
            let description = 'new desc';
            request(app)
                .put(`/api/sensors/${sensor._id}`)
                .send({description})
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.description).to.equal(description);
                    done();
                });
        });
    });

    describe('# GET /api/sensors/', () => {
        it('should get all sensors', (done) => {
            request(app)
                .get('/api/sensors')
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('# DELETE /api/sensors/', () => {
        it('should delete sensor', (done) => {
            request(app)
                .delete(`/api/sensors/${sensor._id}`)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                });
        });
    });
});
