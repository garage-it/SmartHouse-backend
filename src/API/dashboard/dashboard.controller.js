import Dashboard from './dashboard.model.js';

/**
 * Load dashboard and append to req.
 */
function load(req, res, next, id) {
    Dashboard.get(id).then((dashboard) => {
        req.dashboard = dashboard;
        return next();
    }).error((e) => next(e));
}

function get(req, res) {
    return res.json(req.dashboard);
}

function create(req, res, next) {
    var instance = new Dashboard(req.body);

    instance.saveAsync()
        .then(dashboard => res.json(dashboard))
        .error(next);
}

function update(req, res, next) {
    Dashboard.findByIdAndUpdateAsync(req.params.id, req.body, {
        new: true
    })
        .then(dashboard => res.json(dashboard))
        .error(next);
}

function remove(req, res, next) {
    Dashboard.findByIdAndRemoveAsync(req.params.id, req.body)
        .then(dashboard => {
            res.json(dashboard);
            return next();
        })
        .error(next);
}

function query(req, res) {
    Dashboard.findOne({})
        .populate('widgets')
        .then(dashboard => res.json(dashboard));
}

export default {load, get, create, update, query, remove};
