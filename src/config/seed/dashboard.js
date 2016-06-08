import sensorModel from '../../API/sensors/sensor.model';
import dashboardModel from '../../API/dashboard/dashboard.model';

export default { populateDashboard };

function populateDashboard() {
    sensorModel.findAsync({}).then(function(widgets) {
        const ids = widgets.map(widget => widget._id.toString());
        dashboardModel.find({}).remove(function() {
            dashboardModel.create(new dashboardModel({
                widgets: ids
            }));
        });
    });
}
