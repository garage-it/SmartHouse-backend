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
    let inputFilterStub;
    let outputStreamStub;
    let inputSubscribeStub;

    beforeEach(() => {
        let subscriptors = [];
        client = {
            subscribe: (topic, cb)=>cb(),
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

        context('when its device state event', () => {

            it('will parse and write event to inner stream when its device STATE event', () => {
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

            it('will parse and write event to inner stream when its device INFO event', () => {
                let device = 'temperature';
                let topic = `/smart-home/out/${device}`;
                let mockMessage = JSON.stringify({type: 'sensor'});
                let mqttEventData = {
                    device,
                    event: 'device-info',
                    value: JSON.parse(mockMessage)
                };
                client.publish(topic, mockMessage);
                expect(input.write).to.have.been.calledWith(mqttEventData);
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
                    expect(client.publish).to.have.been.calledWith(`/smart-home/in/${config.device}`, config.value,
                        {}, sinon.match.func);
                });

                it('will write report message to the stream', () => {
                    client.publish.lastCall.args[3]();
                    expect(input.write).to.have.been.calledWith({ 
                        event: 'status-report', 
                        message: 'mock', 
                        topic: '/smart-home/in/mockDevice' 
                    });
                });
            });

            context('and device-info event came', () => {
                beforeEach(() => {
                    config = {event: 'device-info', device: 'mock'};
                    publishFn(config);
                });

                it('will publish event', () => {
                    expect(client.publish).to.have.been.calledWith('/smart-home/in/device-info', config.device,
                        {}, sinon.match.func);
                });

                it('will write report message to the stream', () => {
                    client.publish.lastCall.args[3]();
                    expect(input.write).to.have.been.calledWith({ 
                        event: 'device-info-report',
                        message: 'mock',
                        topic: '/smart-home/in/device-info'
                    });
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

                it('will NOT write report message to the stream', () => {
                    client.publish.lastCall && client.publish.lastCall.args[3]();
                    expect(input.write).not.to.have.been.called;
                });
            });
        });
    });
});
