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
    let config;

    beforeEach(function(){
        let subscriptors = [];
        client = {
            subscribe: (topic, cb)=>cb(),
            publish: (topic, message)=>{
                subscriptors.forEach(cb=>cb(topic, message));
            },
            on: (name, cb)=>{
                if ('connect' === name){
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

        input = {
            write: sinon.stub()
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

        proxyquire('./client', {
            mqtt,
            '../data-streams/input': input,
            '../config/env': config
        });
    });

    describe('# Event Subscription', () => {
        it('will connect to broker', function(){
            expect(mqtt.connect).to.have.been.calledWith({
                host: config.mqtt.hostname,
                port: config.mqtt.port,
                auth: `${config.mqtt.username}:${config.mqtt.password}`
            });
        });

        context('when its OUT topic', () => {
            it('should subscribe to an event', () => {
                let device = 'temperature';
                let topic = `/smart-home/OUT/${device}`;
                let mockMessage = 'Its a mock message';
                let mqttEventData = {
                    device,
                    value: mockMessage
                };
                client.publish(topic, mockMessage);
                expect(input.write).to.have.been.calledWith(mqttEventData);
            });
        });

        context('when its not a OUT topic', () => {
            it('should not publish any', () => {
                expect(input.write).to.have.not.been.called;
            });
        });
    });

});
