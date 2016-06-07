import chai from 'chai';
import sinonChai from 'sinon-chai';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import Rx from 'rxjs';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Filtered input', () => {
    let sut;
    let inputStream;

    beforeEach(function () {
        inputStream = new Rx.Subject();
        sut = proxyquire('./filtered.input', {
            './input': {stream: inputStream}
        }).stream;
    });

    it('will filter distinct events for the same device', function () {
        const subscriber = sinon.stub();
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

        const subscription = sut.subscribe(subscriber);
        events.forEach((ev) => inputStream.next(ev));

        expect(subscriber.withArgs(events[0])).to.have.been.calledOnce;
        expect(subscriber.withArgs(events[2])).to.have.been.calledOnce;
    });

    it('will filter distinct events for the multiple devices', function () {
        const subscriber = sinon.stub();
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

        const subscription = sut.subscribe(subscriber);
        events.forEach((ev) => inputStream.next(ev));

        expect(subscriber.withArgs(firstA)).to.have.been.calledOnce;
        expect(subscriber.withArgs(firstB)).to.have.been.calledOnce;
        expect(subscriber.withArgs(secondA)).to.have.been.calledOnce;
        expect(subscriber.withArgs(secondB)).to.have.been.calledOnce;
    });
});
