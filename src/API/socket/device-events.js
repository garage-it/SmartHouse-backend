/**
 * @file provides an API for WS clients to subscribe to device events
 * 
 * USAGE EXAMPLE
 * ```
 * var socket = io('ws://localhost:3000');
 * 
 * socket.on('connect', ()=>log('connect'));
 * socket.on('event', (event)=>log(event));
 * 
 * // immediately subscribes to an 'iddqd' device
 * subscribe('iddqd');
 * // subscribes to 'primary' in 5 seconds
 * setTimeout(()=>{ subscribe('primary'); }, 5000);
 * 
 * function log(message){
 *    console.log(`t ${ +new Date }`, message);
 *  }
 * 
 * function subscribe(device){
 *   socket.emit('subscribe', { device });
 * }
 * ``` 
 */

import Debugger from 'debug';

import input from '../../data-streams/input';
const DEVICE_IN_EVENT = '/smart-home/in';

const debug = Debugger('device-events');

export default function(io){

    io.on('connection', onConnection);

    function onConnection(socket){
        let subscribedDevices = new Set();

        socket.on('subscribe', onSubscribe);
        socket.on('unsubscribe', onUnsubscribe);
        socket.on('disconnect', onDisconnect);
        socket.on('switch', onSwitch);

        let subscriber = input.stream
            .filter(m=>!m.publish)
            .filter(m=>subscribedDevices.has(m.device))
            .subscribe(onEvent, onError);

        function onSubscribe(config){
            subscribedDevices.add(config.device);
        }

        function onUnsubscribe(config){
            subscribedDevices.delete(config.device);
        }

        function onSwitch(config){
            const topic = `${DEVICE_IN_EVENT}/${config.device}`;
            const message = config.command.toString();

            input.write({
                topic,
                message,
                publish: true
            });
        }

        function onEvent(event) {
            socket.emit('event', event);
        }

        function onError(err){
            debug(`Something went wrong: ${err.message}`);
        }

        function onDisconnect(){
            subscriber.unsubscribe();
            debug('Socket disconnected');
        }

    }

}
