import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {expect} from 'chai';
import proxyquire from 'proxyquire';

import Rx from 'rxjs/Rx';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('#Scenario manager', () => {

    let sut;
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
            send: sinon.stub(),
            on: sinon.stub(),
            kill: sinon.stub()
        };

        fork = sinon.stub().returns(childProcess);
        inputStream = new Rx.Subject();
        outputStream = new Rx.Subject();
    });

    beforeEach(() => {
        sut = proxyquire('./scenario.manager', {
            'child_process': {fork},
            '../data-streams/input': {stream: inputStream},
            '../data-streams/output': {stream: outputStream}
        });
    });

    describe('#Starting scenario', () => {
        beforeEach(() => {
            sut.start(scenario);
        });

        it('should for a runner process', () => {
            expect(fork).to.have.been.calledWith(__dirname + '/runner');
        });

        it('should start executing scenario body in child process', () => {
            expect(childProcess.send).to.have.been.calledWith({
                type: 'start',
                content: scenario.body
            });
        });

        it('should notify scenarios when input stream recieves a message', () => {
            let message = 'asd';
            inputStream.next(message);

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
        inputStream.next();

        expect(childProcess.send).not.to.have.been.called;
    });
});
