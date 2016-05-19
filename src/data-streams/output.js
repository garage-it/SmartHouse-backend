// TODO: merge input and output streams into one with different topics

import Rx from 'rxjs/Rx';

let stream = new Rx.Subject();

function write(event){
    stream.next(event);
}

export default {
    stream,
    write
};
