describe('# Output', () => {
    let sut;

    beforeEach(()=>{
        sut = require('./output'); // using require to import new entity each time
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
