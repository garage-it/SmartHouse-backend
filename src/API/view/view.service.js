import mapViewService from '../map-view/map-view.service';
import dashboardViewService from '../dashboard-view/dashboard-view.service';

import ViewModel from '../view/view.model';
import MapViewModel from '../map-view/map-view.model';
import DashboardViewModel from '../dashboard-view/dashboard-view.model';
import SensorModel from '../sensors/sensor.model';

const viewService = {
    getById,
    getAll,
    create,
    update
};

export default viewService;

const viewModelConfig = [
    {
        path: 'mapSubview',
        model: MapViewModel,
        populate: {
            path: 'sensors.sensor',
            model: SensorModel
        }
    },
    {
        path: 'dashboardSubview',
        model: DashboardViewModel,
        populate: {
            path: 'devices',
            model: SensorModel
        }
    }
];

function getById(id) {
    return ViewModel.findById(id)
        .populate(viewModelConfig)
        .exec();
}

function getAll() {
    return ViewModel.find()
        .populate(viewModelConfig)
        .exec();
}

function create(createDto) {
    return Promise.all([
        mapViewService.create(createDto.mapSubview),
        dashboardViewService.create(createDto.dashboardSubview)
    ]).then(values => {
        createDto.mapSubview = values[0].id;
        createDto.dashboardSubview = values[1].id;

        return new ViewModel(createDto).save();
    }).then(onActionCompleted);
}

function update(updateDto) {
    const mapView = updateDto.mapSubview,
        dashboardView = updateDto.dashboardSubview;

    return Promise.all([
        MapViewModel.findByIdAndUpdate(mapView._id, mapView).exec(),
        DashboardViewModel.findByIdAndUpdate(dashboardView._id, dashboardView).exec(),
        ViewModel.findByIdAndUpdate(updateDto._id, updateDto).exec()
    ]).then((values) => onActionCompleted(values[2]));
}

function onActionCompleted({ id }) {
    return getById(id);
}
