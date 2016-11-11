import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import app from '../../index';
import DashboardModel from './dashboard.model';
import SensorModel from '../sensors/sensor.model';

describe('## Dashboard APIs', () => {

    let device;
    let deviceId;

    beforeEach(done => {

        device = {
            description: 'desc',
            type: 'some type',
            mqttId: 'some mqtt id'
        };

        SensorModel.create(device).then(device => {
            deviceId = device._id;
            DashboardModel.create({
                devices: [
                    { device: device._id, hidden: false },
                    { device: '5825941220788d3c52e7766c', hidden: false}
                ]
            })
            .finally(done);
        });

    });

    describe('# GET /api/dashboard/', () => {

        it('should get dashboard', done => {
            request(app)
                .get('/api/dashboard')
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('should populate dashboard with device', (done) => {
            request(app)
                .get('/api/dashboard')
                .then(res => {
                    expect(res.body.devices[0].device.mqttId).equals(device.mqttId);
                    done();
                });
        });

        it('should filter unpopulated sensors', done => {
            request(app)
                .get('/api/dashboard')
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.devices.length).equals(1);
                    done();
                });
        });
    });

    describe('# PUT /api/dashboard', () => {
        it('should update dashboard', done => {

            request(app)
                .put('/api/dashboard')
                .send({devices: []})
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.devices).to.deep.equal([]);
                    done();
                });
        });

        it('should populate updated dashboard with device', done => {

            request(app)
                .put('/api/dashboard')
                .send({devices: [{device: deviceId}]})
                .then(res => {
                    expect(res.body.devices[0].device.mqttId).to.equal(device.mqttId);
                    done();
                });
        });
    });

});
