import uniqueQueue from './unique-queue';

describe('uniqueQueue', () => {
    let sut;

    beforeEach(() => {
        const equals = (a, b) => a.value === b.value;
        sut = uniqueQueue(equals);
    });

    it('should be empty', () => {
        sut.isEmpty.should.be.true;
    });

    context('when enqueue object', () => {
        const obj = {
            value: 'objValue'
        };

        beforeEach(() => {
            sut.enqueue(obj);
        });

        it('should became not empty', () => {
            sut.isEmpty.should.be.false;
        });

        it('should dequeue object', () => {
            sut.dequeue().should.equal(obj);
        });

        it('should not enqueue existed object', () => {
            sut.enqueue({
                value: 'objValue'
            });
            sut.dequeue();
            sut.isEmpty.should.be.true;
        });

        it('should enqueue different object', () => {
            const object2 = {
                value: 'objValue2'
            };
            sut.enqueue(object2);
            sut.dequeue(); // object1
            sut.dequeue().should.equal(object2);
        });

        it('should allow to remove object', () => {
            sut.remove({
                value: 'objValue'
            });
            sut.isEmpty.should.be.true;
        });

        it('should ignore removing not contained objects', () => {
            sut.remove({
                value: 'objValue2'
            });
            sut.isEmpty.should.be.false;
        });

        it('should allow to clear queue', () => {
            sut.clear();
            sut.isEmpty.should.be.true;
        });
    });
});