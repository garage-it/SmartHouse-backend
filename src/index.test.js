import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# index.js', () => {
    let sut,
        mockAppResult = 'mock app result',
        mockConfig = {
            config: 'some config',
            '@noCallThru': true
        },
        mockApp = sinon.spy(function() {
            return mockAppResult;
        });
    mockApp['@noCallThru'] = true;


    beforeEach(() => {
        sut = proxyquire('./index', {
            './config/env': mockConfig,
            './app': mockApp
        });
    });

    it('will run application with provided config', () => {
        expect(mockApp).to.have.been.calledWith(mockConfig);
    });

    it('will export result of application run', () => {
        expect(sut).to.equal(mockAppResult);
    });
});
