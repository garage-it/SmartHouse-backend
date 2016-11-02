import lock from './lock';
import chai from 'chai';
chai.should();

describe('lock', () => {

    let sut;

    beforeEach(() => {
        sut = lock();
    });

    it('should not be locked', () => {
        sut.isLocked.should.be.false;
    });

    context('when lock', () => {
        beforeEach(() => {
            sut.lock();
        });

        it('should be locked', () => {
            sut.isLocked.should.be.true;
        });

        it('should not be locked after unlock', () => {
            sut.unlock();
            sut.isLocked.should.be.false;
        });
    });

});