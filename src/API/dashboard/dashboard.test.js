import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';
import SensorModel from '../sensors/sensor.model';
import DashboardModel from './dashboard.model';

chai.config.includeStack = true;

describe('## Dashboard APIs', () => {

    let device;

    beforeEach(done => {

        device = {
            description: 'desc',
            type: 'some type',
            mqttId: 'some mqtt id'
        };

        SensorModel
            .create(device)
            .then(sensor => {
                device._id = sensor._id;
                done();
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

        it('should not update dashboard when is empty devices', done => {
            request(app)
                .put('/api/dashboard')
                .send({devices: []})
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.devices).to.deep.equal([]);
                    done();
                });
        });

        it('should update dashboard devices', done => {
            device.hidden = true;

            request(app)
                .put('/api/dashboard')
                .send({devices: [device]})
                .then(() => DashboardModel.findOne({device: device._id}))
                .then(updatedDashboardItem => {
                    expect(updatedDashboardItem.hidden).to.equal(device.hidden);
                    done();
                });
        });
    });

});
