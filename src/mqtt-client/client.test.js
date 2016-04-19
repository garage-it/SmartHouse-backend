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
        });

        it('should subscribe to an event', () => {
            let topic = 'event';
            let mqttEventData = { device: 'iddqd' };
            let mockMessage = JSON.stringify(mqttEventData);
            client.publish(topic, mockMessage);
            expect(input.write).to.have.been.calledWith(mqttEventData);
        });
    });

});