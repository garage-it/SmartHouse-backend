import request from 'supertest-as-promised';
import { OK } from 'http-status';
import fs from 'fs';
import Promise from 'bluebird';
import app from '../../index';
import filesService from '../files/files.service';
import MapViewModel from './map-view.model';
import SensorModel from '../sensors/sensor.model';

Promise.promisifyAll(fs);

describe('/api/map-view', () => {

    let sut;

    beforeEach(() => {
        sut = request(app);
    });

    after(() => {
        return filesService.deleteAllFiles();
    });

    describe('GET /', () => {
        const mapView = {
            pictureName: 'hello'
        };

        it('should respond with blank map view when it is not yet created', () => {
            return sut.get('/api/map-view')
                .expect(OK)
                .then((res) => res.body.should.not.contain(mapView));
        });

        it('should respond with map view when map view is created', () => {
            return MapViewModel.create(mapView)
                .then(() => sut.get('/api/map-view'))
                .then((res) => res.body.should.contain(mapView));
        });

    });

    describe('PUT /', () => {

        const sensor = {
            description: 'some description',
            type: 'some type',
            mqttId: 'distance'
        };


        let sensorUpdates;

        const infoUpdates = {
            name: 'name',
            description: 'description',
            active: true
        };

        let updates;

        beforeEach('create sensor', () => {

            return SensorModel
                .create(sensor)
                .then(({ id }) => sensorUpdates = [{
                    sensor: id,
                    position: {
                        x: 1,
                        y: 2
                    }
                }]);
        });

        beforeEach('send request', () => {
            updates = Object.assign({}, infoUpdates, {
                sensors: sensorUpdates,
                pictureName: 'newPictureName'
            });

            sut = sut.put('/api/map-view')
                .send(updates)
                .expect(OK)
                .then(({ body }) => body);

        });

        it('should ignore updates of picture name', () => {
            return sut.then((mapView) => {
                expect(mapView.pictureName).to.not.equal(updates.pictureName);
            });
        });

        it('should update name description and active flag', () => {
            return sut.then((mapView) => {
                mapView.should.include(infoUpdates);
            });
        });

        it('should rewrite all sensors', () => {
            return sut.then((mapView) => {
                mapView.sensors.length.should.equal(sensorUpdates.length);
            });
        });

        describe('sensors', () => {

            beforeEach(function () {
                sut = sut.then((mapView) => mapView.sensors[0]);
            });

            it('should store sensors positions', () => {
                return sut.then(({ position }) => {
                    position.should.deep.equal(sensorUpdates[0].position);
                });
            });

            it('should link sensors', () => {
                return sut.then(({ sensor }) => {
                    sensor._id.should.equal(sensorUpdates[0].sensor);
                });
            });

            it('should pre-populate sensors', () => {
                return sut.then((sensor) => {
                    sensor.should.contain(sensor);
                });
            });

        });

    });


    describe('POST /picture', () => {

        const testFilePath = 'test/assets/file.txt';

        beforeEach(() => {
            sut = request(app)
                .post('/api/map-view/picture')
                .field('name', 'file')
                .attach('file', testFilePath)
                .then(({ body }) => body);
        });

        it('should upload new picture', () => {
            return sut
                .then(({ pictureName }) => filesService.resolveFilePath(pictureName))
                .then((filePath) => fs.lstatAsync(filePath));
        });

        it('should save picture name in map-view', () => {
            let mapView;

            return sut
                .then((body) => mapView = body)
                .then(() => MapViewModel.findOne())
                .then((storedMapView) => {
                    String(storedMapView._id).should.equal(mapView._id);
                    storedMapView.pictureName.should.equal(mapView.pictureName);
                });
        });

    });
});
