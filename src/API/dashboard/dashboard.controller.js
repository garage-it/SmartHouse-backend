import DashboardModel from './dashboard.model';
import dashboardService from './dashboard.service';

export default {
    create,
    update,
    query
};

function create(req, { send }, next) {
    const dashboardView = req.body;
    dashboardService.create(dashboardView)
        .then(send)
        .catch(next);
}

function update(req, res) {
    DashboardModel.findOneAndUpdateAsync({}, req.body, { new: true })
        .then(dashboard => {
            DashboardModel.populate(dashboard, getDevicePopulationConfig(), (err, result) => {
                res.json(result);
            });
        });
}

function query(req, res) {
    DashboardModel.findOne({})
        .populate(getDevicePopulationConfig())
        .then(result => {
            res.json(result);
        });
}

function getDevicePopulationConfig() {
    return {
        path: 'devices',
        model: 'Sensor'
    };
}

