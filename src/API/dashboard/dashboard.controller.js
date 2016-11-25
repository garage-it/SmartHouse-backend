import Dashboard from './dashboard.model.js';

function update(req, res) {
    Dashboard.findOneAndUpdateAsync({}, req.body, { new: true })
        .then(dashboard => {
            Dashboard.populate(dashboard, getDevicePopulationConfig(), (err, result) => {
                res.json(result);
            });
        });
}

function query(req, res) {
    Dashboard.findOne({})
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

export default { update, query };
