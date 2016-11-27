import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';

describe('# Device statistic saver', () => {
    let input,
        Caiman,
        caimanSaveStub,
        MongoClient,
        mongoConnectStub,
        sut,
        statistic;

    const mockedDevice = 'mockedDevice';

    beforeEach(() => {
        input = {
            stream: new Rx.Subject()
        };

        Caiman = class {
            constructor() {}
        };

        caimanSaveStub = env.stub()

        Caiman.prototype.save = caimanSaveStub;

        mongoConnectStub = env.stub().callsArg(1);

        MongoClient = {
            connect: mongoConnectStub
        };

        sut = proxyquire('./statisticSaver', {
            '../data-streams/input': input,
            'mongodb': { MongoClient },
            'caiman': { Caiman }
        });

        statistic = {};

        sut(statistic);
    });

    it('will connect to database when function is invoked', () => {
        input.stream.next({ device: mockedDevice, event: 'wrong' });
        expect(mongoConnectStub).to.have.been.called.once;
    });

    it('won\'t search sensors in db if event is NOT \'status\'', () => {
        input.stream.next({ device: mockedDevice, event: 'wrong' });
        expect(caimanSaveStub).not.to.have.been.called.once;
    });

    describe('event has proper status', () => {
        beforeEach(() => {
            input.stream.next({ device: mockedDevice, event: 'status' });
        });

        it('will create new statistic saver when this is new device', () => {
            expect(statistic).to.have.property(mockedDevice);
        });

        it('will call save function', () => {
            expect(caimanSaveStub).to.have.been.called.once;
        });
    });
});