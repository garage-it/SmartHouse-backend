const proxyquire = require('proxyquire').noCallThru();

describe('files service', () => {

    const fileName = 'file name';

    let sut,
        del,
        config,
        result,
        fs;

    beforeEach(() => {
        del = env.stub();

        fs = {
            unlinkAsync: env.stub()
        };

        config = {
            filesPath: 'filesPath'
        };

        sut = proxyquire('./files.service', {
            del,
            fs,
            '../../config/env': config
        });
    });

    describe('clean', () => {

        const deleteResult = 'deleteResult';
        let patterns;

        beforeEach(() => {
            del.returns(deleteResult);
            result = sut.cleanFolder();
            patterns = del.lastCall.args[0];
        });

        it('should clean files folder content', () => {
            patterns.should.contain(config.filesPath + '/**');
        });

        it('should not delete files folder', () => {
            patterns.should.contain('!' + config.filesPath);
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
                        fs.unlinkAsync.should.calledWith(`${config.filesPath}/${fileName}`);
                    });
            });

            it('should ignore error when file is not exists', () => {
                fs.unlinkAsync.rejects('aaa');
                return sut.tryDeleteFile(fileName);
            });

        });

    });

});