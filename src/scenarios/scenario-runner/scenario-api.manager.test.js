import proxyquire from 'proxyquire';

import Rx from 'rxjs/Rx';

describe('Scenario API manager', () => {

    let sut;
    let inputStream;
    let outputStream;

    beforeEach(() => {
        inputStream = new Rx.Subject();
        outputStream = new Rx.Subject();
    });

    beforeEach(() => {
        sut = proxyquire('./scenario-api.manager', {
        });
    });

    describe('#createScenarioApiManager', () => {
        let version;
        let api;
        beforeEach((done) => {
            version = '0.0.1';
            let scenarioApiManager = sut.create(inputStream, outputStream);
            scenarioApiManager.get_api(version)
                .then(_api=>{
                    api = _api;
                    done();
                })
                .catch(done);
        });

        context('#get_api', ()=>{
            it('will have proper version defined', () => {
                expect(api.version).to.equal(version);
            });

            it('will send data to output stream', ()=>{
                const DEVICE_ID = 'some_device';
                const OUT_VALUE = 'ON';
                let spy = env.spy();
                outputStream.subscribe(spy);
                api.device.get(DEVICE_ID).send(OUT_VALUE);
                expect(spy).to.have.been.calledWith({
                    device: DEVICE_ID,
                    value: OUT_VALUE,
                    event: 'status'
                });
            });

            it('will store current device value', ()=>{
                const DEVICE_ID = 'some_device';
                const IN_VALUE = 'OFF';
                inputStream.next({ device: DEVICE_ID, value: IN_VALUE });
                let device = api.device.get(DEVICE_ID);
                expect(device.value).to.deep.equal(IN_VALUE);
            });

            it('will keep device value up to date', ()=>{
                const DEVICE_ID = 'some_device';
                inputStream.next({ device: DEVICE_ID, value: 'OFF' });
                let instance1 = api.device.get(DEVICE_ID);
                inputStream.next({ device: DEVICE_ID, value: 'ON' });
                let instance2 = api.device.get(DEVICE_ID);
                expect(instance1.value).to.equal(instance2.value);
            });

            context('#on', ()=>{

                beforeEach(() => {
                    env.stub(process, 'on');
                });

                afterEach(() => {
                    process.on.restore();
                });

                it('will trigger callbacks on events from specific devices', ()=>{
                    const DEVICE_ID = 'some_device';
                    let spy = env.spy();
                    api.on('message', [DEVICE_ID], spy);
                    inputStream.next({ device: DEVICE_ID });
                    expect(spy).to.have.been.called;
                });

                it('will not trigger callbacks on events from other devices', ()=>{
                    const DEVICE_ID = 'some_device';
                    let spy = env.spy();
                    api.on('message', ['-robocow-'], spy);
                    inputStream.next({ device: DEVICE_ID });
                    expect(spy).not.to.have.been.called;
                });

                it('will subscribe for messages from external process once', ()=>{
                    const DEVICE_ID = 'some_device';
                    const message = 'wazzup';
                    let spy = env.spy();
                    api.on('message', [DEVICE_ID], spy);
                    inputStream.subscribe(spy);

                    process.on.callArgWith(1, {type: message, content: message});
                    expect(spy).to.have.been.calledWith(message);

                    api.on('message', [DEVICE_ID], spy);
                    expect(process.on).to.have.been.calledOnce;
                });
            });

        });


    });
});
