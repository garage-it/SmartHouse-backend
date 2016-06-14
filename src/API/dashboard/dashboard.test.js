import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';
import DashboardModel from './dashboard.model';
import SensorModel from '../sensors/sensor.model';

chai.config.includeStack = true;

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
            DashboardModel.create({devices: [device._id]})
                .then(() => {
                    done();
                })
                .catch(done);
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
                    expect(res.body.devices.length).equals(1);
                    expect(res.body.devices[0].mqttId).equals(device.mqttId);
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
                .send({devices: [deviceId]})
                .then(res => {
                    expect(res.body.devices[0].mqttId).to.equal(device.mqttId);
                    done();
                });
        });
    });

});
