import DashboardViewModel from './dashboard-view.model';
import SensorModel from '../sensors/sensor.model';

const dashboardViewService = {
    create,
    update
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

function update(model) {
    var id = model._id;
    delete model._id;

    return DashboardViewModel
        .update({ '_id': id }, { $set: model })
        .then(() => getById(id));
}

function onActionCompleted({ id }) {
    return getById(id);
}
