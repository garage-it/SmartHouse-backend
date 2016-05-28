import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# MQTT client', () => {
    let mqtt;
    let client;
    let input;
    let output;
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

        output = {
            stream: new Rx.Subject()
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
        it('will connect to broker', function(){
            expect(mqtt.connect).to.have.been.calledWith({
                host: config.mqtt.hostname,
                port: config.mqtt.port,
                auth: `${config.mqtt.username}:${config.mqtt.password}`
            });
        });

        context('when its device state event', () => {
            it('will parse and write event to inner stream', () => {
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

    });

    describe('# Event Outputting To MQTT', ()=>{

        it('will write event to MQTT when raised in inner output stream', ()=>{
            let event = {
                device: 'event_device_id',
                value: 'event_value'
            };
            output.stream.next(event);
            expect(client.publish).to.have.been.calledWith(`/smart-home/in/${event.device}`, event.value);
        });

    });

});
