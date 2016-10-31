import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# MQTT client', () => {
    let mqtt;
    let client;
    let input;
    let output;
    let config;
    let config2;
    let inputFilterStub;
    let outputStreamStub;
    let inputSubscribeStub;

    beforeEach(() => {
        let subscriptors = [];
        client = {
            subscribe: (topic, cb)=> cb && cb(),
            publish: (topic, message)=> {
                subscriptors.forEach(cb=>cb(topic, message));
            },
            on: (name, cb)=> {
                if ('connect' === name) {
                    cb();
                } else if ('message' === name) {
                    subscriptors.push(cb);
                }
            }
        };

        mqtt = {
            '@noCallThru': true,
            connect: ()=>client
        };

        inputSubscribeStub = {subscribe: sinon.stub()};
        outputStreamStub = {subscribe: sinon.stub(), next: sinon.stub()};
        inputFilterStub = sinon.stub().returns(inputSubscribeStub);

        input = {
            write: sinon.stub(),
            stream: {filter: inputFilterStub}
        };

        output = {
            stream: outputStreamStub
        };

        config = {
            mqtt: {
                port: 1883,
                hostname: 'sputnik',
                username: 'UsErNaMe',
                password: 'PaSsWoRd'
            }
        };

        sinon.spy(mqtt, 'connect');
        sinon.spy(client, 'subscribe');
        sinon.spy(client, 'publish');

        proxyquire('./client', {
            mqtt,
            '../data-streams/input': input,
            '../data-streams/output': output,
            '../config/env': config
        });
    });

    describe('# Event Subscription', () => {
        it('will connect to broker', () => {
            expect(mqtt.connect).to.have.been.calledWith({
                host: config.mqtt.hostname,
                port: config.mqtt.port,
                auth: `${config.mqtt.username}:${config.mqtt.password}`
            });
        });

        it('will subscribe on publish events', () => {
            expect(outputStreamStub.subscribe).to.have.been.called;
        });

        it('will parse and write event to inner stream when its device STATUS event', () => {
            let device = 'temperature';
            let topic = `/smart-home/out/${device}`;
            let mockMessage = JSON.stringify('Its a mock message');
            let mqttEventData = {
                device,
                event: 'status',
                value: mockMessage
            };
            client.publish(topic, mockMessage);
            expect(input.write).to.have.been.calledWith(mqttEventData);
        });

        describe('when it\'s device-info event', () => {
            let topic, mockMessage, mqttEventData, clock2;
            beforeEach(function () {
                let device = 'faked';
                topic = `/smart-home/out/${device}`;
                mockMessage = JSON.stringify({type: 'sensor'});
                mqttEventData = {
                    device,
                    event: 'device-info',
                    value: JSON.parse(mockMessage)
                };
                clock2 = sinon.useFakeTimers();
            });
            afterEach(function(){
                clock2.restore();
            });

            it('will parse and write event to inner stream', () => {
                client.publish(topic, mockMessage);
                expect(input.write).to.have.been.calledWith(mqttEventData);
            });

            it('will NOT publish new device-info to mqtt if there is no queue', () => {
                client.publish(topic, mockMessage);
                expect(client.publish).not.to.have.been.calledWith('/smart-home/out/device-info');
            });

            it('will publish new device-info to mqtt if there is queue', () => {
                config = {event: 'device-info', device: 'faked'};
                config2 = {event: 'device-info', device: 'faked_too'};
                let publishFn = outputStreamStub.subscribe.lastCall.args[0];
                publishFn(config);
                publishFn(config2);
                client.publish(topic, mockMessage);
                expect(client.publish.getCall(2).args).to.eql(['/smart-home/in/device-info', 'faked_too']);
            });
            it('will clear queue after timeout', (done) => {
                config = {event: 'device-info', device: 'faked'};
                config2 = {event: 'device-info', device: 'faked_too'};
                let publishFn = outputStreamStub.subscribe.lastCall.args[0];
                publishFn(config);
                clock2.tick(60 * 1000);
                publishFn(config2);
                expect(client.publish.getCall(1).args).to.eql(['/smart-home/in/device-info', 'faked_too']);
                done();
            });
        });

        context('when its INPUT topic', () => {
            let publishFn;
            let config;
            beforeEach(() => {
                client.publish = sinon.stub();
                publishFn = outputStreamStub.subscribe.lastCall.args[0];
            });

            context('and status event came', () => {
                beforeEach(() => {
                    config = {
                        event: 'status',
                        device: 'mockDevice',
                        value: 'mock'
                    };
                    publishFn(config);
                });

                it('will publish event', () => {
                    expect(client.publish).to.have.been.calledWith(`/smart-home/in/${config.device}`, config.value);
                });
            });

            context('and device-info event came', () => {
                beforeEach(() => {
                    config = {event: 'device-info', device: 'mock'};
                    publishFn(config);
                });

                it('will publish event if there is no event in handling ', () => {
                    expect(client.publish).to.have.been.calledWith('/smart-home/in/device-info', config.device);
                });

                it('will NOT publish event if there is event in handling', () => {
                    config = {event: 'device-info', device: 'mock2'};
                    publishFn(config);
                    expect(client.publish).not.to.have.been.calledWith('/smart-home/in/device-info', config.device);
                });
            });

            context('and unknown event came', () => {
                beforeEach(() => {
                    config = {event: 'unknown', device: 'mock'};
                    publishFn(config);
                });

                it('will NOT publish event', () => {
                    expect(client.publish).not.to.have.been.called;
                });
            });
        });
    });
});
