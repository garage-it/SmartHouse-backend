import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';
import DashboardModel from './dashboard.model';
import SensorModel from '../sensors/sensor.model';

chai.config.includeStack = true;

describe('## Dashboard APIs', () => {

    let widget;
    let dashboard;

    beforeEach(done => {

        widget = {
            description: 'desc',
            type: 'some type',
            mqttId: 'some mqtt id'
        };

        SensorModel.create(widget).then(widget => {
            DashboardModel.create({widgets: [widget._id]})
                .then(dash => {
                    dashboard = dash;
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

        it('should populate dashboard with widget', (done) => {
            request(app)
                .get('/api/dashboard')
                .then(res => {
                    expect(res.body.widgets.length).equals(1);
                    expect(res.body.widgets[0].mqttId).equals(widget.mqttId);
                    done();
                });
        });
    });

    describe('# POST /api/dashboard', () => {

        let widgets = [];
        let dashboard = {
            widgets
        };

        it('should create a new dashboard', (done) => {
            request(app)
                .post('/api/dashboard')
                .send(dashboard)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.widgets).to.deep.equal(widgets);
                    done();
                });
        });
    });

    describe('# PUT /api/dashboard/:dashboardId', () => {
        it('should update dashboard', done => {

            request(app)
                .put(`/api/dashboard/${dashboard._id}`)
                .send({widgets: []})
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.widgets).to.deep.equal([]);
                    done();
                });
        });
    });

    describe('# DELETE /api/dashboard/', () => {
        it('should delete dashboard', done => {
            request(app)
                .delete(`/api/dashboard/${dashboard._id}`)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

});
