/**
 * @file provides an API for WS clients to subscribe to device events
 */

import input from '../../data-streams/input';
import Debugger from 'debug';

const debug = Debugger('device-events');

export default function(io){

    io.on('connection', onConnection);

    function onConnection(socket){
        let subscribedDevices = new Set();

        socket.on('subscribe', onSubscribe);
        socket.on('unsubscribe', onUnsubscribe);
        socket.on('disconnect', onDisconnect);

        let subscriber = input.stream
            .filter(m=>subscribedDevices.has(m.device))
            .subscribe(onEvent, onError);

        function onSubscribe(config){
            subscribedDevices.add(config.device);
        }

        function onUnsubscribe(config){
            subscribedDevices.delete(config.device);
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