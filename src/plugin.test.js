import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Plugin interface', () => {
    let config = {}, context = {}, sut;

    let mockCommanderPath = 'some_path';
    let mockPromise = class {
        constructor(fn) {
            this.fn = fn;
        }
    };
    let mockFs = {
        stat: sinon.spy()
    };
    let mockPath = {
        resolve: sinon.spy(function() {
            return mockCommanderPath;
        })
    };

    beforeEach(() => {
        let plugin = proxyquire('./plugin', {
            'bluebird': mockPromise,
            'fs': mockFs,
            'path': mockPath
        });
        context = {
            startScript: sinon.spy(),
            stopScript: sinon.spy(),
            getConfig: sinon.spy()
        };
        sut = plugin(config)(context);
    });

    it('will provide required interface', () => {
        expect(sut.name).to.equal('smart-house-backend');
        expect(typeof sut.init).to.equal('function');
        expect(typeof sut.start).to.equal('function');
        expect(typeof sut.stop).to.equal('function');
        expect(typeof sut.destroy).to.equal('function');
    });

    it('will check commander path exists on tart', () => {
        let mPromise = sut.init();
        expect(typeof mPromise.fn).to.equal('function');
        mPromise.fn();
        expect(mockFs.stat).to.have.been.calledWith(mockCommanderPath);
    });

    it('will run context startScript on start', () => {
        sut.start();
        expect(context.startScript).to.have.been.calledWith('smart-house-backend', mockCommanderPath, 'start');
    });

    it('will run context stopScript on stop', () => {
        sut.stop();
        expect(context.stopScript).to.have.been.calledWith('smart-house-backend', mockCommanderPath);
    });
});
