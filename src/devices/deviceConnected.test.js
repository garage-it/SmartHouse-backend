import chai from 'chai';
import sinon from 'sinon';
import sinonAsPromised from 'sinon-as-promised'; //eslint-disable-line
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';

chai.use(sinonChai);

describe('#Device connected', () => {
    let input,
        Sensor,
        Debugger,
        saveAsync,
        debug,
        sut,
        saveAsyncPromise,
        findStub;

    function setup (resolve, value) {
        if (resolve) {
            saveAsync.resolves(value);
        }
        else {
            saveAsync.rejects(value);
        }
    }

    beforeEach(function () {
        input = {
            stream: new Rx.Subject()
        };

        saveAsync = sinon.stub();
        findStub = sinon.stub();

        debug = sinon.spy();

        Sensor = class {
            constructor() {
                this.saveAsync = function () {
                    saveAsyncPromise = saveAsync();
                    return saveAsyncPromise;
                };
            }
        };

        Sensor.find = findStub;

        Debugger = function () {
            return debug;
        };

        sut = proxyquire('./deviceConnected', {
            '../data-streams/input': input,
            '../API/sensors/sensor.model': Sensor,
            'debug': Debugger
        });

        sut();
    });

    it('will save device to  db if record was NOT  found in  db', function () {
        setup(true, 'device');
        input.stream.next({ value: 'a', event: 'add' });
        let findDeviceCallback =  findStub.getCall(0).args[1];
        findDeviceCallback('error', []);
        expect(saveAsync).to.have.been.called.once;
    });

    it('will NOT save device to  db if record was  found in  db', function () {
        setup(true, 'device');
        input.stream.next({ value: 'a', event: 'add' });
        let findDeviceCallback =  findStub.getCall(0).args[1];
        findDeviceCallback('error', ['device1']);
        expect(saveAsync).not.to.have.been.called;
    });

    it('will call success callback on  succesful save', function (done) {
        setup(true, 'someDevice');
        input.stream.next({ value: 'a', event: 'add' });
        let findDeviceCallback =  findStub.getCall(0).args[1];
        findDeviceCallback('error', []);
        saveAsyncPromise.then(function (device) {
            expect(debug.firstCall.args[0]).to.equal(`added device: '${device}' to db`);
            done();
        }).catch(done);
    });

    it('will call error callback on  Error saving to  db', function (done) {
        setup(false, 'someError');
        input.stream.next({ value: 'a', event: 'add' });
        let findDeviceCallback =  findStub.getCall(0).args[1];
        findDeviceCallback('error', []);
        saveAsyncPromise.catch(function (error) {
            expect(debug.firstCall.args[0]).to.equal(`Error: '${error}' occured`);
            done();
        }).catch(done);
    });
});