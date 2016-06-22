import Dashboard from './dashboard.model';

function update(req, res) {
    req.body.devices
        .forEach(item => {
            Dashboard
                .findOne({device: item._id})
                .update({hidden: item.hidden})
                .exec();
        });

    res.json(req.body);
}

function query(req, res) {
    Dashboard.find({})
        .populate('device')
        .then(widgets => res.json({
            devices: widgets.map(widget =>
                Object.assign({}, widget.device.toObject(), {hidden: widget.hidden}))
        }));
}

export default { update, query };
