import {stream as inputMessages} from './input';
import Rx from 'rxjs/Rx';

const deviceStreams = new Map();
const mergedFilteredStream = new Rx.Subject();
const INPUT_STREAM_DELAY = 500;

export {mergedFilteredStream as stream};

inputMessages
    .subscribe((event) => {
        const usedStream = getDeviceStream(event.device);
        usedStream.next(event.value);
    });

function createDeviceStream(device) {
    const deviceStream = new Rx.Subject();

    deviceStream
        .distinctUntilChanged()
        .sampleTime(INPUT_STREAM_DELAY)
        .subscribe((value) => {
            mergedFilteredStream.next({
                device,
                value
            });
        });
    deviceStreams.set(device, deviceStream);
}

function getDeviceStream(device) {
    if (!deviceStreams.has(device)) {
        createDeviceStream(device);
    }
    return deviceStreams.get(device);
}
