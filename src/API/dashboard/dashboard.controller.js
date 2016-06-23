import Dashboard from './dashboard.model.js';

function update(req, res) {
    Dashboard.findOneAndUpdateAsync({}, req.body, { new: true })
        .then(dashboard => {
            Dashboard.populate(dashboard, getDevicePopulationConfig(), (err, result) => {
                res.json(getDashboardData(result));
            });
        });
}

function query(req, res) {
    Dashboard.findOne({})
        .populate(getDevicePopulationConfig())
        .then(result => {
            res.json(getDashboardData(result));
        });
}

function getDashboardData(dashboard) {
    return {
        devices: dashboard.toObject().devices
            .map(device => Object.assign({}, device.device, device))
    };
}

function getDevicePopulationConfig() {
    return {
        path: 'devices',
        populate: {
            path: 'device',
            model: 'Sensor'
        }
    };
}

export default { update, query };
