import sensorModel from '../../API/sensors/sensor.model';
import dashboardModel from '../../API/dashboard/dashboard.model';

export default { populateDashboard };

function populateDashboard() {
    sensorModel.findAsync({})
        .then(function(devices) {
            dashboardModel.find({}).remove(function() {
                devices.forEach(device => {
                    dashboardModel.create({
                        device: device._id.toString(),
                        hidden: false
                    });
                });
            });
        });
}
