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
        config,
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
            stream: new Rx.Subject(),
            write: sinon.spy()
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

        config = {
            plugAndPlay: true
        };

        sut = proxyquire('./deviceConnected', {
            '../data-streams/input': input,
            '../API/sensors/sensor.model': Sensor,
            '../config/env': config,
            'debug': Debugger
        });

        sut();
    });

    describe('And record was NOT found in db', function () {

        it('will save device to db', function () {
            setup(true, 'device');
            input.stream.next({ value: 'a', event: 'device-info' });
            let findDeviceCallback =  findStub.getCall(0).args[1];
            findDeviceCallback('error', []);

            expect(saveAsync).to.have.been.called.once;
        });

        it('will call success callback on successful save', function (done) {
            setup(true, 'someDevice');
            input.stream.next({ value: 'a', event: 'device-info' });
            let findDeviceCallback =  findStub.getCall(0).args[1];
            findDeviceCallback('error', []);

            saveAsyncPromise.then(function (device) {
                expect(debug.firstCall.args[0]).to.equal(`Added device: '${device}' to db`);
                done();
            }).catch(done);
        });

        it('will add \'device-add\' to input stream after addition to db if Plug-n-Play is enabled', function (done) {
            setup(true, {deviceData: 'faked'});
            input.stream.next({ value: 'a', event: 'device-info' });
            let findDeviceCallback =  findStub.getCall(0).args[1];
            findDeviceCallback('error', []);

            saveAsyncPromise.then(() => {
                expect(input.write).to.have.been.calledWith({
                    event: 'device-add',
                    data: {deviceData: 'faked'}
                });
                done();
            }).catch(done);
        });

        it('will NOT add \'device-add\' to input stream after addition to db if Plug-n-Play is disabled', function (done) {
            config.plugAndPlay = false;
            setup(true, {deviceData: 'faked'});
            input.stream.next({ value: 'a', event: 'device-info' });
            let findDeviceCallback =  findStub.getCall(0).args[1];
            findDeviceCallback('error', []);

            saveAsyncPromise.then(() => {
                expect(input.write).not.to.have.been.called;
                done();
            }).catch(done);
        });

        it('will call error callback on Error saving to db', function (done) {
            setup(false, 'someError');
            input.stream.next({ value: 'a', event: 'device-info' });
            let findDeviceCallback =  findStub.getCall(0).args[1];
            findDeviceCallback('error', []);

            saveAsyncPromise.catch(function (error) {
                expect(debug.firstCall.args[0]).to.equal(`Error: '${error}' occured`);
                done();
            }).catch(done);
        });
    });

    it('will NOT save device to db if record was found in db', function () {
        setup(true, 'device');
        input.stream.next({ value: 'a', event: 'device-info' });
        let findDeviceCallback =  findStub.getCall(0).args[1];
        findDeviceCallback('error', ['device1']);

        expect(saveAsync).not.to.have.been.called;
    });


});