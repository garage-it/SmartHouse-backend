import sensorModel from '../../API/sensors/sensor.model';
import dashboardModel from '../../API/dashboard/dashboard.model';

export default { populateDashboard };

/* istanbul ignore next */
function populateDashboard() {
    sensorModel.findAsync({}).then(function(devices) {
        dashboardModel.find({}).remove(function() {
            dashboardModel.create(new dashboardModel({
                devices: devices.map((device) => device._id)
            }));
        });
    });
}
