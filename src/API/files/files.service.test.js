const proxyquire = require('proxyquire').noCallThru();

describe('files service', () => {

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

});