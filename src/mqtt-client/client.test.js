import proxyquire from 'proxyquire';

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
                return client;
            }
        };

        mqtt = {
            '@noCallThru': true,
            connect: ()=>client
        };

        inputSubscribeStub = {subscribe: env.stub()};
        outputStreamStub = {subscribe: env.stub(), next: env.stub()};
        inputFilterStub = env.stub().returns(inputSubscribeStub);

        input = {
            write: env.stub(),
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

        env.spy(mqtt, 'connect');
        env.spy(client, 'subscribe');
        env.spy(client, 'publish');

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
            let mockMessage = 'Its a mock message';
            let mqttEventData = {
                device,
                event: 'status',
                value: mockMessage
            };
            client.publish(topic, mockMessage);
            expect(input.write).to.have.been.calledWith(mqttEventData);
        });

        context('when its INPUT topic', () => {
            let publishFn;
            let config;
            beforeEach(() => {
                client.publish = env.stub();
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
