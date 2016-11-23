import sut from './try-async';
import Promise from 'bluebird';

describe('tryAsync', () => {

    it('should resolve result when promise resolved', () => {
        return sut(Promise.resolve('ok'))
            .then(result => result.should.equal('ok'));
    });

    it('should resolve result with fallback when promise rejected', () => {
        return sut(Promise.reject('not ok'), 'fallback')
            .then(result => result.should.equal('fallback'));
    });

});