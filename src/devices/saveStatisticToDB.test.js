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

        sut = proxyquire('./saveStatisticToDB', {
            '../data-streams/input': input,
            'mongodb': { MongoClient },
            'caiman': { Caiman }
        });
    });

    describe('new data comes', () => {
        beforeEach(() => {
            statistic = {};
            sut(statistic);
        });

        it('will connect to database when sut is invoked', () => {
            input.stream.next({ device: mockedDevice, event: 'wrong' });
            expect(MongoClient.connect).to.have.been.called.once;
        });

        it('won\'t save data in db if event is NOT \'status\'', () => {
            input.stream.next({ device: mockedDevice, event: 'wrong' });
            expect(caimanSaveStub).not.to.have.been.called.once;
        });

        describe('event has proper status', () => {
            beforeEach(() => {
                input.stream.next({ device: mockedDevice, event: 'status' });
            });

            it('will create new statistic caiman saver', () => {
                expect(caimanSaveStub).to.have.been.called.once;
            });


            it('will create new statistic saver on statisticSavers object', () => {
                expect(statistic).to.have.property(mockedDevice);
            });

            it('will call save function from caiman', () => {
                expect(caimanSaveStub).to.have.been.called.once;
            });
        });
    });

    describe('comes data for existing device', () => {

        beforeEach(() => {
            statistic = {
                [mockedDevice]: {
                    save: env.stub()
                }
            };
            sut(statistic);
            input.stream.next({ device: mockedDevice, event: 'status' });
        });

        it('will use existing caiman saver to save data to db', () => {
            expect(statistic[mockedDevice].save).to.have.been.called.once;
        });
    });


});