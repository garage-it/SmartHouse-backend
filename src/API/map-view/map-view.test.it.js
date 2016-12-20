import request from 'supertest-as-promised';
import { OK } from 'http-status';
import fs from 'fs';
import Promise from 'bluebird';
import app from '../../index';
import filesService from '../files/files.service';
import viewService from '../view/view.service';
import SensorModel from '../sensors/sensor.model';
import ViewModel from '../view/view.model';

Promise.promisifyAll(fs);

describe('/api/map-view', () => {

    let sut;

    beforeEach(() => {
        sut = request(app);
    });

    after(() => {
        return filesService.deleteAllFiles();
    });

    describe('/:mapViewId', () => {

        let mapView;

        beforeEach('create view', () => {
            return Promise.resolve(
                viewService.create({
                    name: 'name',
                    description: 'desc',
                    defaultSubview: 'mapSubview',
                    "mapSubview": {
                        "active": true,
                        "sensors": []
                    }
                }).then(createdView => mapView = createdView.mapSubview));
        });

        describe('POST /picture', () => {

            const testFilePath = 'test/assets/file.txt';

            beforeEach(() => {
                sut = request(app)
                    .post(`/api/map-view/${mapView._id}/picture`)
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
