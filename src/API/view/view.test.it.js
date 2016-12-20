import request from 'supertest-as-promised';
import { OK } from 'http-status';
import app from '../../index';
import viewService from './view.service';
import SensorModel from '../sensors/sensor.model';

describe('/api/views', () => {

    const sensor = {
        mqttId: 'mqttId',
        type: 'type',
        description: 'description'
    }

    let sensorId;
    beforeEach('create sensors', () => {
        return Promise.resolve(
            SensorModel
                .create(sensor)
                .then(({ id }) => sensorId = id)
        );
    });

    describe('# GET /views', () => {

        let viewId;

        beforeEach('create views', () => {
            return Promise.resolve(
                viewService.create({
                    name: 'name',
                    description: 'desc',
                    defaultSubview: 'mapSubview',
                    "mapSubview": {
                        "active": true,
                        "sensors": [
                            {
                                "position": {
                                    "x": 100,
                                    "y": 134
                                },
                                "sensor": sensorId
                            }
                        ]
                    }
                }).then(createdView => viewId = createdView._id.toString()));
        });

        it('should return array of view objects', done => {
            request(app)
                .get('/api/views')
                .expect(OK)
                .then(res => {
                    expect(res.body).to.be.a('array');
                    done();
                })
                .catch(done);
        });

        it('should contains id of created object', done => {
            request(app)
                .get('/api/views')
                .expect(OK)
                .then(res => {
                    expect(res.body[0]._id).to.equal(viewId);
                    done();
                })
                .catch(done);
        });
    });

    describe('# POST /views', () => {

        let body;
        beforeEach(() => {
            body = {
                "dashboardSubview": {
                    "active": true,
                    "devices": [ sensorId ]
                },
                "defaultSubview": "dashboardSubview",
                "description": "View description",
                "name": "View name"
            };
        });

        it('should create a new view', done => {
            request(app)
                .post('/api/views')
                .send(body)
                .expect(OK)
                .then(res => {
                    expect(res.body).to.contain.keys(Object.keys(body));
                    done();
                })
                .catch(done);
        });

        it('should create a new view with one device on the dashboard', done => {
            request(app)
                .post('/api/views')
                .send(body)
                .expect(OK)
                .then(res => {
                    expect(res.body.dashboardSubview.devices).to.be.a('array');
                    expect(res.body.dashboardSubview.devices[0]).to.include(sensor);
                    done();
                })
                .catch(done);
        });
    });

    describe('# GET /views/:id', () => {

        let viewId;

        beforeEach(() => {
            return Promise.resolve(
                viewService.create({
                    name: 'name',
                    description: 'desc',
                    defaultSubview: 'mapSubview'
                }))
                .then(createdView => viewId = createdView._id.toString());
        });

        it('should get the view by provided id', done => {
            request(app)
                .get(`/api/views/${viewId}`)
                .expect(OK)
                .then(res => {
                    expect(res.body._id).to.equal(viewId);
                    done();
                })
                .catch(done);
        });

        it('should return 404 error when provided id does not exist', done => {
            request(app)
                .get('/api/views/invalid_id')
                .then(res => {
                    expect(res.status).to.be.above(400);
                    done();
                })
                .catch(done);
        });
    });
});
