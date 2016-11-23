const proxyquire = require('proxyquire').noCallThru();

describe('files service', () => {

    const fileName = 'file name';

    let sut,
        del,
        config,
        result;

    beforeEach(() => {
        del = env.stub();

        config = {
            filesPath: 'filesPath'
        };

        sut = proxyquire('./files.service', {
            del,
            '../../config/env': config
        });
    });

    describe('clean', () => {

        const deleteResult = 'deleteResult';

        beforeEach(() => {
            del.returns(deleteResult);
            result = sut.deleteAllFiles();
        });

        it('should clean files folder content', () => {
            del.should.calledWith(`${config.filesPath}/**`);
        });

        it('should delegate delete response handling', () => {
            result.should.equal(deleteResult);
        });

    });


    describe('resolve file path', () => {

        it('should resolve file path relative to config', () => {
            sut.resolveFilePath(fileName).should.equal(`${config.filesPath}/${fileName}`);
        });

    });

    describe('try delete file', () => {

        it('should resolve nothing when filename is missed', () => {
            return sut.tryDeleteFile();
        });

        context('when file name present', () => {

            it('should delete file', () => {
                return sut.tryDeleteFile(fileName)
                    .then(() => {
                        del.should.calledWith(`${config.filesPath}/${fileName}`);
                    });
            });

            it('should ignore error when file is not exists', () => {
                del.rejects('aaa');
                return sut.tryDeleteFile(fileName);
            });

        });

    });

});