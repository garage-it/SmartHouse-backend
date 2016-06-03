import Sensor from '../API/sensors/sensor.model';
import {stream} from '../data-streams/input';
import Debugger from 'debug';

const debug = Debugger('device-connected');


const DEVICE_CONNECTED_EVENT = 'add';

export default function trackDeviceConnection() {
    stream
        .filter(message => message.event === DEVICE_CONNECTED_EVENT)
        .subscribe(saveDevice, onError);

    function saveDevice (data) {
        Sensor.find({description : data.value.description}, function (error, records) {
            if (records.length){
                debug('Device already added');
            }else{
                var device = new Sensor(data.value);
                device.saveAsync()
                    .then(device => onDeviceAdded(device))
                    .catch(onError);
            }
        });

    }

    function onDeviceAdded (device) {
        debug(`added device: '${device}' to db`);
    }

    function onError(error) {
        debug(`Error: '${error}' occured`);
    }
}