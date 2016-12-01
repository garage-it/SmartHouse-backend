import Sensor from '../API/sensors/sensor.model';
import input from '../data-streams/input';

const DEVICE_STATUS_EVENT = 'status';

export default function () {
    input.stream
        .filter(message => message.event === DEVICE_STATUS_EVENT)
        .subscribe(saveLastValue);

    function saveLastValue ({ device, value }) {
        Sensor.find({ mqttId: device }, onDeviceFound);

        function onDeviceFound (error, records) {
            if (!records.length) {
                return;
            }

            records.map(record => {
                record = Object.assign(record, {
                    value,
                    valueUpdated: Date.now()
                });

                record.saveAsync();
            });
        }
    }
}
