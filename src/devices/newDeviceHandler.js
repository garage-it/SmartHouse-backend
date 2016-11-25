import Sensor from '../API/sensors/sensor.model';
import input from '../data-streams/input';
import output from '../data-streams/output';

import Debugger from 'debug';

const debug = Debugger('SH_BE:new-device-handler');

const DEVICE_STATUS_EVENT = 'status';

export default function handleUnknownDeviceData() {
    input.stream
        .filter(message => message.event === DEVICE_STATUS_EVENT)
        .subscribe(checkDevice, onError);

    function checkDevice (data) {

        Sensor.find({
            mqttId: data.device
        }, function (error, records) {
            if (records.length) {
                records = records.forEach((record)=> {
                    record = Object.assign(record, {
                        value: data.value,
                        valueUpdated: Date.now()
                    });
                    record.saveAsync().catch(()=> {
                        debug(`Error: '${error}' occured`);
                    });
                });
            } else {
                let outputEvent = {
                    device: data.device,
                    event: 'device-info'
                };
                debug('Received data from unknown device');
                output.write(outputEvent);
            }
        });
    }

    function onError(error) {
        debug(`Error: '${error}' occured`);
    }
}
