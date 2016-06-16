import Sensor from '../API/sensors/sensor.model';
import input from '../data-streams/input';
import Debugger from 'debug';
import config from '../config/env';

const debug = Debugger('SH_BE:device-connected');


const DEVICE_INFO_EVENT = 'device-info';

export default function trackDeviceConnection() {
    input.stream
        .filter(message => message.event === DEVICE_INFO_EVENT)
        .subscribe(saveDevice, onError);

    function saveDevice(data) {

        Sensor.find({
            mqttId: data.device
        }, function (error, records) {

            if (records.length) {
                debug('Device already added');
            } else {
                let sensorModel = Object.assign({
                    mqttId: data.device,
                    executor: isExecutor(data.value.type)
                }, data.value);

                let device = new Sensor(sensorModel);

                device.saveAsync()
                    .then(device => onDeviceAdded(device))
                    .catch(onError);
            }
        });

    }

    function onDeviceAdded(device) {
        debug(`Added device: '${device}' to db`);

        if (config.plugAndPlay) {
            input.write({
                event: 'device-add',
                data: device
            });
        }
    }

    function onError(error) {
        debug(`Error: '${error}' occured`);
    }
    
    function isExecutor(type) {
        let exectorTypes = ['relay', 'servo'];
        return  exectorTypes.indexOf(type) !== -1;
    }
}