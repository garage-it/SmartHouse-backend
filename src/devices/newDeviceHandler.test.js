import chai from 'chai';
import sinon from 'sinon';
import sinonAsPromised from 'sinon-as-promised'; //eslint-disable-line
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';

chai.use(sinonChai);

describe('# New device handler', () => {
    let input,
        output,
        Sensor,
        sut,
        mockedDevice,
        findStub;


    beforeEach(() => {
        input = {
            stream: new Rx.Subject()
        };

        output = {
            write: sinon.spy()
        };

        findStub = sinon.stub();

        Sensor = class {
            constructor() {
            }
        };

        Sensor.find = findStub;

        mockedDevice = 'mockedDevice';

        sut = proxyquire('./newDeviceHandler', {
            '../data-streams/input': input,
            '../data-streams/output': output,
            '../API/sensors/sensor.model': Sensor
        });

        sut();
    });

    it('will NOT search sensors in db if event is NOT \'status\'', () => {
        input.stream.next({ device: mockedDevice, event: 'wrong' });
        expect(findStub).not.to.have.been.called.once;
    });



    describe('there are status events in db', () => {
        let findDeviceCallback;
        beforeEach(() => {
            input.stream.next({ device: mockedDevice, event: 'status' });
            findDeviceCallback = findStub.getCall(0).args[1];
        });

        it('will search sensors in db if event is \'status\'', () => {
            expect(findStub).to.have.been.called.once;
        });

        it('will add to output stream event if event device is unique', function () {
            findDeviceCallback('error', []);
            expect(output.write).to.have.been.calledWith({
                device: mockedDevice,
                event: 'device-info'
            });
        });

        it('will NOT add to output stream event if event device is NOT unique', function () {
            findDeviceCallback('error', [{
                mqttId: mockedDevice
            }]);
            expect(output.write).not.to.have.been.called;
        });

    });


});