import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';

describe('# Device statistic saver', () => {
    let input,
        MongoClient,
        Caiman,
        newCaimanStub,
        caimanSaveStub,
        sut,
        statistic;

    const mockedDevice = 'mockedDevice';

    beforeEach(() => {
        input = {
            stream: new Rx.Subject()
        };

        newCaimanStub = env.stub();

        Caiman = class {
            constructor() {
                newCaimanStub();
            }
        };

        caimanSaveStub = env.stub();

        Caiman.prototype.save = caimanSaveStub;

        MongoClient = {
            connect: env.stub().callsArg(1)
        };

        sut = proxyquire('./timeseries.service', {
            '../../data-streams/input': input,
            'mongodb': { MongoClient },
            'caiman': { Caiman }
        });
    });

    it('will get devices statistic', () => {
        const device = 'device';
        sut.saveStatisticToDB();
        input.stream.next({ device, value: 'value', event: 'status' });

        expect(sut.getDevicesStatistic()[device]).to.be.an.instanceof(Caiman);
    });

    describe('when new data comes', () => {
        beforeEach(() => {
            sut.saveStatisticToDB();
            input.stream.next({ device: mockedDevice, event: 'wrong' });
        });

        it('will connect to database when sut is invoked', () => {
            expect(MongoClient.connect).to.have.been.called;
        });

        it('won\'t save data in db if event is NOT \'status\'', () => {
            expect(caimanSaveStub).not.to.have.been.called.once;
        });

        describe('event has proper status', () => {
            beforeEach(() => {
                input.stream.next({ device: mockedDevice, event: 'status' });
            });

            it('will create new statistic caiman saver', () => {
                expect(caimanSaveStub).to.have.been.called.once;
            });


            it('will create new statistic saver', () => {
                expect(sut.getDevicesStatistic()).to.have.property(mockedDevice);
            });

            it('will call save function from caiman', () => {
                expect(caimanSaveStub).to.have.been.called.once;
            });
        });
    });

    describe('when data comes for existing device', () => {

        beforeEach(() => {
            statistic = {
                [mockedDevice]: {
                    save: env.stub()
                }
            };
            sut.saveStatisticToDB(statistic);
            input.stream.next({ device: mockedDevice, event: 'status' });
        });

        it('will use existing caiman saver to save data to db', () => {
            expect(sut.getDevicesStatistic()[mockedDevice].save).to.have.been.called.once;
        });
    });
});