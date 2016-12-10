import request from 'supertest-as-promised';
import { OK } from 'http-status';
import app from '../../index';
import DashboardModel from './dashboard.model';
import SensorModel from '../sensors/sensor.model';

describe('## Dashboard APIs', () => {

    let sut;
    let device;
    let deviceId;

    beforeEach(() => {
        sut = request(app);
    });

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
                    deviceId,
                    '5825941220788d3c52e7766c'
                ]
            })
            .finally(done);
        });

    });

    describe('# POST /api/dashboard/', () => {
        let body;
        let dashboard;

        beforeEach(() => {
            body = {
                devices: []
            };

            sut = sut.post('/api/dashboard')
            .send(body)
            .expect(OK)
            .then(({ body }) => body);
        });

        it('should create view', () => {
            return sut.then((view) => {
                console.log(view);
                view.should.be.an('object');
            });
        });

        it('should create view with ref on dashboard', () => {
            return sut.then((view) => {
                view['dashboard'].should.be.a('string');
            });
        });

        it('should create dashboard', () => {
            sut = sut.then((view) => {
                return DashboardModel
                    .find({ _id: view.dashboard })
                    .then(dashboard => dashboard);
            });
            return sut.then((dashboard) => {
                dashboard.length.should.equal(1);
            });
        });
    });

    describe('# GET /api/dashboard/', () => {

        it('should get dashboard', done => {
            request(app)
                .get('/api/dashboard')
                .expect(OK)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('should populate dashboard with device', (done) => {
            request(app)
                .get('/api/dashboard')
                .then(res => {
                    expect(res.body.devices[0].mqttId).deep.equals(device.mqttId);
                    done();
                });
        });

        it('should filter unpopulated sensors', done => {
            request(app)
                .get('/api/dashboard')
                .expect(OK)
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
                .expect(OK)
                .then(res => {
                    expect(res.body.devices).to.deep.equal([]);
                    done();
                });
        });

        it('should populate updated dashboard with device', done => {

            request(app)
                .put('/api/dashboard')
                .send([device])
                .then(res => {
                    expect(res.body.devices[0].mqttId).to.equal(device.mqttId);
                    done();
                });
        });
    });

});
