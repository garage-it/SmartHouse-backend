import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import output from '../data-streams/output';

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
                if(topic === 'event') {
                    subscriptors.forEach(cb=>cb(topic, message));
                }
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
            write: sinon.spy()
        };

        config = {
            mqtt: {
                port: 1883,
                host: 'sputnik',
                user: 'UsErNaMe',
                pass: 'PaSsWoRd'
            }
        };

        sinon.spy(mqtt, 'connect');
        sinon.spy(client, 'subscribe');
        sinon.spy(client, 'on');
        sinon.spy(client, 'publish');

        proxyquire('./client', {
            mqtt,
            '../data-streams/input': input,
            '../config/env': config
        });
    });

    describe('# Event Subscription', () => {
        it('will connect to broker', function(){
            expect(mqtt.connect).to.have.been.calledWith({
                port: 1883,
                host: 'sputnik',
                auth: 'UsErNaMe:PaSsWoRd'
            });

            expect(client.on).to.have.been.called;
        });

        it('should subscribe to an event', () => {
            expect(client.subscribe).to.have.been.called;

            let topic = 'event';
            let mqttEventData = { device: 'iddqd' };
            let mockMessage = JSON.stringify(mqttEventData);
            client.publish(topic, mockMessage);
            expect(input.write).to.have.been.calledWith(mqttEventData);
        });

        it('should send messages to the mqtt', function() {
            let mqttEventData = { device: 'iddqd', data: 'test' };
            let mqttDevice = '/smart-home/in/' + mqttEventData.device;
            let mqttData = mqttEventData.data;

            output.write(mqttEventData);
            expect(client.publish).to.have.been.calledWith(mqttDevice, mqttData);
        });
    });

});
