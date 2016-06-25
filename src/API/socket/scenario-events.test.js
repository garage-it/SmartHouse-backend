import chai from 'chai';
import sinonChai from 'sinon-chai';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';
import socketIoMocks from 'socket-io-mocks';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Socket Device Events', () => {
    let input;
    let socket;

    beforeEach(function () {
        socket = new socketIoMocks.socket();
        input = new Rx.Subject();

        let sut = proxyquire('./scenario-events', {
            '../../data-streams/input': {stream: input}
        });

        let io = socketIoMocks.server()();
        sut(io);
        io._connect(socket);
    });

    it('should send a message on scenario-status-change event', () => {
        let event = {
            event: 'scenario-status-change',
            someProp: 'someValue'
        };

        input.next(event);

        expect(socket.emit).to.have.been.calledWith('scenario-status-change', event);
    });

    it('should not send messages for other events', () => {
        let event = {
            event: 'some other event',
            someProp: 'someValue'
        };

        input.next(event);

        expect(socket.emit).not.to.have.been.called;
    });
});