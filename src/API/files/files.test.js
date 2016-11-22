import request from 'supertest-as-promised';
import mockFs from 'mock-fs';
import httpStatus from 'http-status';
import fs from 'fs';
import Promise from 'bluebird';
import app from './../../index';
import filesService from './files.service';

Promise.promisifyAll(fs);

describe('## Files APIs', () => {

    let sut;

    describe('GET /api/files/**', () => {
        const fileName = 'd74c678c7580deddbe8b008eab317b79';
        const fileContent = 'my file content';

        beforeEach(() => {
            mockFs({
                [filesService.resolveFilePath(fileName)]: fileContent
            });

            sut = request(app);
        });

        afterEach(() => {
            mockFs.restore();
        });

        it('should respond with file when found', () => {
            return sut
                .get(`/api/files/${fileName}`)
                .expect(httpStatus.OK)
                .then(({ text }) => {
                    expect(text).to.equal(fileContent);
                });
        });

        it('should respond with not found when file not found', () => {
            return sut
                .get('/api/files/notfound')
                .expect(httpStatus.NOT_FOUND);
        });
    });

});
