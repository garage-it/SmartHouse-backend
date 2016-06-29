import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';
import SensorModel from './sensor.model';
import DashboardModel from '../dashboard/dashboard.model';

chai.config.includeStack = true;

describe.only('## Sensor APIs', () => {

    let sensor;
    let devices;

    beforeEach((done)=>{

        sensor = {
            description: 'desc',
            type: 'some type',
            mqttId: 'some mqtt id'
        };

        const raw_devices = [];

        raw_devices.push(new SensorModel({
            description: 'some description',
            type: 'some type',
            mqttId: 'distance'
        }));

        raw_devices.push(new SensorModel({
            description: 'temperature',
            type: 'some other type',
            mqttId: 'temperature'
        }));

        raw_devices.push(new SensorModel({
            description: 'humidity',
            type: 'some other type',
            mqttId: 'humidity'
        }));

        DashboardModel
            .create({devices: []})
            .then(() => SensorModel.create(...raw_devices))
            .then(()=>{

                devices = raw_devices
                    .map(dev=>dev.toObject())
                    .map(dev=> {
                        dev._id = dev._id.toString();
                        return dev;
                    });
                done();
            })
            .catch(done);

    });

    describe('# POST /api/sensors', () => {

        it('should create a new sensor', (done) => {
            request(app)
                .post('/api/sensors')
                .send(sensor)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.contain(sensor);
                    done();
                });
        });

        it('should not create a new sensor with existing mqtt id', (done) => {
            request(app)
                .post('/api/sensors')
                .send({
                    description: 'desc',
                    type: 'some type',
                    mqttId: 'distance'
                })
                .then(res => {
                    expect(res.status).to.be.above(400);
                    done();
                })
                .catch(done);
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
                .get(`/api/sensors/${devices[0]._id}`)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.contain(devices[0]);
                    done();
                });
        });

        it('should report error with message - Not found, when sensor does not exists', (done) => {
            request(app)
                .get('/api/sensors/ffffffffffffffffffffffff')
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
                .put(`/api/sensors/${devices[0]._id}`)
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
                .delete(`/api/sensors/${devices[0]._id}`)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });


    describe('# Error Handling', () => {
        it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
            request(app)
                .get('/api/sensors/non-existing-id')
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
                .then(res => {
                    expect(res.body.message).to.equal('Internal Server Error');
                    done();
                })
                .catch(done);
        });

        it('should handle error - type is required', (done) => {
            request(app)
                .post('/api/sensors/')
                .send({
                    description: 'some description'
                })
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
                .then(res => {
                    expect(res.body.message).to.equal('Internal Server Error');
                    done();
                })
                .catch(done);
        });
    });

    describe('hooks', () => {

        it('should create dasboard instance when create sensor', (done) => {
            compareDevicesBetweenDashboard(done);
        });

        it('should remove dasboard instance when sensor instance is removed', (done) => {
            var removeDeviceId = devices.pop()._id;

            SensorModel
                .findOne({_id: removeDeviceId}, (err, content) => {
                    content.remove(() => {
                        compareDevicesBetweenDashboard(done);
                    });
                });
        });

        function compareDevicesBetweenDashboard(done) {
            DashboardModel.findOne({})
                .then(data => {
                    expect(data.devices
                        .map(item => item.device.toString())
                        .sort())
                        .to.deep.equal(devices
                        .map(device => device._id)
                        .sort());
                    done();
                })
                .catch(done);
        }
    });

});
