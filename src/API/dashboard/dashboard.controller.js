import Dashboard from './dashboard.model.js';

function update(req, res) {
    Dashboard.findOneAndUpdateAsync({}, req.body, { new: true })
        .then(dashboard => {
            Dashboard.populate(dashboard, getPopulationConfig(), (err, result) => {
                res.json(modifyResponse(result));
            });
        });
}

function query(req, res) {
    Dashboard.findOne({})
        .populate(getPopulationConfig())
        .then(dashboard => {
            res.json(modifyResponse(dashboard));
        });
}

// TODO: change function name and straighten the logic of mapping
function modifyResponse(data) {
    const dashboard = data.toObject();
    dashboard.devices = dashboard.devices.map(item => {
        item.device.hidden = item.hidden;
        return item.device;
    });
    return dashboard;
}

function getPopulationConfig() {
    return {
        path: 'devices',
        populate: {
            path: 'device',
            model: 'Sensor'
        }
    };
}

export default { update, query };
