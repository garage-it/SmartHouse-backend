import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';

describe('# Save last device value', () => {
    let sut,
        input,
        Sensor,
        mockDevice,
        mockValue;

    beforeEach(() => {
        input = {
            stream: new Rx.Subject()
        };

        mockValue = 'mock-value';
        mockDevice = 'mockedDevice';

        Sensor = class {
            constructor() {
            }
        };

        Sensor.find = env.stub();

        sut = proxyquire('./saveDeviceLastValue', {
            '../data-streams/input': input,
            '../API/sensors/sensor.model': Sensor
        });

        sut();
    });

    describe('new data comes', () => {
        let onDeviceFound, saveAsync;

        beforeEach(() => {
            saveAsync = env.stub();
            input.stream.next({ device: mockDevice, event: 'status', value: mockValue });
            onDeviceFound = Sensor.find.getCall(0).args[1];
        });

        it('should search sensors in db if event is \'status\'', () => {
            Sensor.find.should.have.been.calledWith({ mqttId: mockDevice }, sinon.match.func);
        });

        it('should not save value when is not known sensor', () => {
            onDeviceFound(null, []);

            saveAsync.should.have.not.been.called;
        });

        context('when sensor is known', () => {
            let records;

            beforeEach(() => {
                records = [{
                    someKey: 'someValue',
                    saveAsync
                }];
                onDeviceFound(null, records);
            });

            it('should set last sensor value', () => {
                records[0].value.should.equal(mockValue);
            });

            it('should save device', function () {
                records[0].saveAsync.should.have.been.called;
            });
        });
    });
});
