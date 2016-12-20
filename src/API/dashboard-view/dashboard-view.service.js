import DashboardViewModel from './dashboard-view.model';
import SensorModel from '../sensors/sensor.model';

const dashboardViewService = {
    create
};

export default dashboardViewService;

function getById(id) {
    return DashboardViewModel.findById(id)
        .populate({
            path: 'devices',
            model: SensorModel
        })
        .exec();
}

function create(createDto) {
    return new DashboardViewModel(createDto)
        .save()
        .then(onActionCompleted);
}

function onActionCompleted({ id }) {
    return getById(id);
}
