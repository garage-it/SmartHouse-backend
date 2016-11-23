import request from 'supertest-as-promised';
import env from './../../config/env';
import httpStatus from 'http-status';
import app from './../../index';
import filesService from './files.service';

const fs = require('fs');
const path = require('path');

describe('## Files APIs', () => {

    const fileName = 'd74c678c7580deddbe8b008eab317b79';
    const imagePath = './test/displayImage.gif';
    const image = fs.readFileSync(imagePath);

    beforeEach(done => {
        fs.writeFile(path.join(env.filesPath, fileName), image, error => {
            done();
        });
    });

    afterEach(done => {
        filesService.cleanFolder();
        done();
    });

    describe('# GET /api/files', () => {
        it('should get list of all saved files on the server', done => {
            request(app)
                .get('/api/files')
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.contain(fileName);
                    done();
                })
                .catch(done);
        });
    });

    describe('# POST /api/files', () => {
        it('should upload a new image on the server', done => {
            request(app)
                .post('/api/files')
                .field('name', 'displayImage')
                .attach('displayImage', imagePath)
                .expect(httpStatus.OK)
                .then(res => {
                    filesService.getFiles()
                        .then(files => {
                            expect(files).to.contain(res.body);
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });
    });

    describe(`# POST /api/files/${fileName}`, () => {
        it('should upload a new image on the server and remove the old one', done => {
            request(app)
                .post(`/api/files/${fileName}`)
                .field('name', 'displayImage')
                .attach('displayImage', imagePath)
                .expect(httpStatus.OK)
                .then(res => {
                    filesService.getFiles()
                        .then(files => {
                            expect(files).to.contain(res.body);
                            expect(files).to.not.contain(fileName);
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });
    });

    describe(`# REMOVE /api/files/${fileName}`, () => {
        it('should remove an image from the server', done => {
            request(app)
                .delete(`/api/files/${fileName}`)
                .expect(httpStatus.OK)
                .then(res => {
                    filesService.getFiles()
                        .then(files => {
                            expect(files).to.not.contain(fileName);
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });
    });

});
