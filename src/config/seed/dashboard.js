import sensorModel from '../../API/sensors/sensor.model';
import dashboardModel from '../../API/dashboard/dashboard.model';

export default { populateDashboard };

function populateDashboard() {
    sensorModel.findAsync({}).then(function(devices) {
        const ids = devices.map(device => device._id.toString());
        dashboardModel.find({}).remove(function() {
            dashboardModel.create(new dashboardModel({
                devices: ids
            }));
        });
    });
}
