import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';

describe('#Scenario manager', () => {

    let sut;
    let filteredInputStream;
    let inputStream;
    let outputStream;
    let fork;
    let childProcess;


    const scenario = {
        id: 123,
        body: 'alert();'
    };

    beforeEach(() => {
        childProcess = {
            send: env.stub(),
            on: env.stub(),
            kill: env.stub()
        };

        fork = env.stub().returns(childProcess);
        filteredInputStream = new Rx.Subject();
        outputStream = new Rx.Subject();
        inputStream = new Rx.Subject();
        scenario.updateAsync = env.stub().returns({
            then: env.stub().callsArg(0)
        });
    });

    beforeEach(() => {
        sut = proxyquire('./scenario.manager', {
            'child_process': {fork},
            '../data-streams/filtered.input': {stream: filteredInputStream},
            '../data-streams/input': {stream: inputStream},
            '../data-streams/output': {stream: outputStream}
        });
    });

    describe('#Starting scenario', () => {
        beforeEach(() => {
            sut.start(scenario);
        });

        it('should for a runner process with scenario body', () => {
            expect(fork).to.have.been.calledWith(__dirname + '/scenario-runner/runner', [scenario.body]);
        });

        it('should notify scenarios when input stream recieves a message', () => {
            let message = 'asd';
            filteredInputStream.next(message);

            expect(childProcess.send).to.have.been.calledWith({
                type: 'message',
                content: message
            });

        });

        it('should write to output stream when the message from child process is recieved', (done) => {
            let message = 'messge';
            outputStream.subscribe((message) => {
                expect(message).to.equal(message);
                done();
            });

            childProcess.on.withArgs('message').callArgWith(1, {
                type: 'message',
                content: message
            });
        });

        it('should stop scenario before starting if it is already running', function () {
            fork.reset();
            sut.start(scenario);
            childProcess.on.withArgs('exit').callArg(1);

            expect(fork).to.have.been.calledAfter(childProcess.kill);
        });

        context('#scenario stopped working itself', () => {
            it('should exec a query to update scenario as inactive when it ends working', () => {
                const successExitCode = 0;
                childProcess.on.withArgs('exit').callArgWith(1, successExitCode);

                expect(scenario.updateAsync).to.have.been.calledWith({active: false});
            });

            it('should exec a query to update scenario as inactive when it stops because of an error', () => {
                const errorExitCode = 1;
                childProcess.on.withArgs('exit').callArgWith(1, errorExitCode);

                expect(scenario.updateAsync).to.have.been.calledWith({active: false});
            });


            it('should exec a query to update scenario as inactive when it stops because of an error', () => {
                const subscriber = env.stub();
                inputStream.subscribe(subscriber);
                const errorExitCode = 1;
                childProcess.on.withArgs('exit').callArgWith(1, errorExitCode);

                expect(subscriber).to.have.been.calledWith({
                    id: scenario.id,
                    active: false,
                    event: 'scenario-status-change'
                });
            });
        });
    });

    it('should stop scenario', () => {
        sut.start(scenario);
        sut.stop(scenario);

        expect(childProcess.kill).to.have.been.called;
    });

    it('will stop sending messages to scenario after it closes', () => {
        sut.start(scenario);
        childProcess.send.reset();
        childProcess.on.withArgs('exit').callArg(1);
        filteredInputStream.next();

        expect(childProcess.send).not.to.have.been.called;
    });
});
