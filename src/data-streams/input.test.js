import chai from 'chai';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Input', () => {
    let sut;

    beforeEach(()=>{
        sut = require('./input'); // using require to import new entity each time
    });

    it('will provide a stream and a possibility to write to it', (done)=>{
        sut.stream
        .take(3)
        .toArray()
        .subscribe((events)=>{
            expect(events).to.deep.equal([1,2,3]);
            done();
        });

        sut.write(1);
        sut.write(2);
        sut.write(3);
    });

});