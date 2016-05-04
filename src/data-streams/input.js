/**
 * @file Is an event stream of all incoming events in the system
 * provides method to write to that stream
 */

import Rx from 'rxjs/Rx';

let stream = new Rx.Subject();

function write(event){
    stream.next(event);
}

export default {
    stream,
    write
};
