import request from 'supertest-as-promised';
import { OK } from 'http-status';
import fs from 'fs';
import Promise from 'bluebird';
import app from '../../index';
import filesService from '../files/files.service';
import mapViewService from './map-view.service';
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

    describe('POST /', () => {

        const sensor = {
            description: 'some description',
            type: 'some type',
            mqttId: 'distance'
        };


        let sensors;

        const mapViewCreateDto = {
            name: 'name',
            description: 'description',
            active: true
        };

        let body;

        beforeEach('create sensor', () => {

            return SensorModel
                .create(sensor)
                .then(({ id }) => sensors = [{
                    sensor: id,
                    position: {
                        x: 1,
                        y: 2
                    }
                }]);
        });

        beforeEach('send request', () => {
            body = Object.assign({}, mapViewCreateDto, {
                sensors,
                pictureName: 'newPictureName'
            });

            sut = sut.post('/api/map-view')
                .send(body)
                .expect(OK)
                .then(({ body }) => body);

        });

        it('should ignore updates of picture name', () => {
            return sut.then((mapView) => {
                expect(mapView.pictureName).to.not.equal(body.pictureName);
            });
        });

        it('should update name description and active flag', () => {
            return sut.then((mapView) => {
                mapView.should.include(mapViewCreateDto);
            });
        });

        it('should rewrite all sensors', () => {
            return sut.then((mapView) => {
                mapView.sensors.length.should.equal(sensors.length);
            });
        });

        describe('sensors', () => {

            beforeEach(function () {
                sut = sut.then((mapView) => mapView.sensors[0]);
            });

            it('should store sensors positions', () => {
                return sut.then(({ position }) => {
                    position.should.deep.equal(sensors[0].position);
                });
            });

            it('should link sensors', () => {
                return sut.then(({ sensor }) => {
                    sensor._id.should.equal(sensors[0].sensor);
                });
            });

            it('should pre-populate sensors', () => {
                return sut.then((sensor) => {
                    sensor.should.contain(sensor);
                });
            });

        });

    });


    describe('/:mapViewId', () => {

        let mapView;

        beforeEach('create map view', () => {
            return mapViewService.create({
                name: 'name',
                description: 'desc',
                active: true
            }).then((createdMapView) => mapView = createdMapView);
        });

        describe('GET /', () => {


            beforeEach(() => {
                sut = request(app)
                    .get('/api/map-view/' + mapView.id )
                    .expect(OK)
                    .then(({ body }) => body);
            });

            it('should respond with map view', () => {
                return sut
                    .then((storedMapView) => {
                        (mapView._id == storedMapView._id).should.be.true;
                    });
            });

        });

        describe('POST /picture', () => {

            const testFilePath = 'test/assets/file.txt';

            beforeEach(() => {
                sut = request(app)
                    .post('/api/map-view/' + mapView.id + '/picture')
                    .field('name', 'file')
                    .attach('file', testFilePath)
                    .expect(OK)
                    .then(({ body }) => body);
            });

            it('should upload new picture', () => {
                return sut
                    .then(({ pictureName }) => filesService.resolveFilePath(pictureName))
                    .then((filePath) => fs.lstatAsync(filePath));
            });

            it('should save picture name in map-view', () => {
                return sut
                    .then((storedMapView) => {
                        storedMapView.pictureName.should.not.equal(mapView.pictureName);
                    });
            });

            it('should respond with map view', () => {
                return sut
                    .then((storedMapView) => {
                        (mapView._id == storedMapView._id).should.be.true;
                    });
            });

        });

    });

});
