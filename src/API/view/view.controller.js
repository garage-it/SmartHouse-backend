import ViewModel from './view.model';
import viewService from './view.service';

import       MapViewModel from '../map-view/map-view.model';
import DashboardViewModel from '../dashboard-view/dashboard-view.model';
import        SensorModel from '../sensors/sensor.model';

export default {
    query,
    create,
    get
};

function get(req, { send }, next) {
    const { id } = req.params;
    viewService.getById(id)
        .then(send)
        .catch(next);
}

function query(req, res, next) {
    viewService.getAll()
        .then(result => res.json(result))
        .catch(next);
}

function create(req, res, next) {
    viewService.create(req.body)
        .then(view => res.json(view))
        .catch(next);
}