import chai from 'chai';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# runner.js', () => {
    let mockBabel = {},
        mockIndex = {
            '@noCallThru': true
        },
        sut;

    beforeEach(() => {
        sut = proxyquire('./runner', {
            './index': mockIndex,
            'babel-register': mockBabel
        });
    });

    it('will export result of index.js', () => {
        expect(sut).to.equal(mockIndex);
    });
});
