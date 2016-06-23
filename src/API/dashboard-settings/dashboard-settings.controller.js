import Dashboard from './dashboard-settings.model';

function update(req, res) {
    Dashboard.findOneAndUpdateAsync({}, req.body, { new: true })
        .then(dashboard => {
            Dashboard.populate(dashboard, { path: 'devices' }, (err, result) => {
                res.json(result);
            });
        });
}

function query(req, res) {
    Dashboard.findOne({})
        .populate('devices')
        .then(dashboard => res.json(dashboard));
}

export default { update, query };
