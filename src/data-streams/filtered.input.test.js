import proxyquire from 'proxyquire';
import Rx from 'rxjs';

describe('# Filtered input', () => {
    let sut;
    let inputStream;
    /*
        NOTE: there is a better way of testing rx - http://www.mostovenko.com/posts/2016-05-21-testing-with-rxjs.html
        but in rxjs 5 ReactiveTest is missing - https://github.com/ReactiveX/rxjs/tree/master/src/testing
     */

    beforeEach(() => {
        env.stub(Rx.Subject.prototype, 'sampleTime').returnsThis();

        inputStream = new Rx.Subject();
        sut = proxyquire('./filtered.input', {
            './input': {stream: inputStream},
            'rxjs': Rx
        }).stream;
    });

    it('will filter distinct events for the same device', () => {
        const subscriber = env.stub();
        const events = [
            {
                device: 'a',
                value: 1
            },
            {
                device: 'a',
                value: 1
            },
            {
                device: 'a',
                value: 2
            }
        ];

        sut.subscribe(subscriber);
        events.forEach((ev) => inputStream.next(ev));

        expect(subscriber.withArgs(events[0])).to.have.been.calledOnce;
        expect(subscriber.withArgs(events[2])).to.have.been.calledOnce;
    });

    it('will filter distinct events for the multiple devices', () => {
        const subscriber = env.stub();
        const firstA = {
            device: 'a',
            value: 1
        };
        const firstB = {
            device: 'b',
            value: 1
        };
        const secondA = {
            device: 'a',
            value: 2
        };
        const secondB = {
            device: 'b',
            value: 2
        };
        const events = [firstA, firstA, firstB, firstA, firstB, secondB, secondA, secondA];

        sut.subscribe(subscriber);
        events.forEach((ev) => inputStream.next(ev));

        expect(subscriber.withArgs(firstA)).to.have.been.calledOnce;
        expect(subscriber.withArgs(firstB)).to.have.been.calledOnce;
        expect(subscriber.withArgs(secondA)).to.have.been.calledOnce;
        expect(subscriber.withArgs(secondB)).to.have.been.calledOnce;
    });
});
