import Sensor from './sensor.model';

/**
 * Load sensor and append to req.
 */
function load(req, res, next, id) {
    Sensor.get(id).then((sensor) => {
        req.sensor = sensor;
        return next();
    }).error((e) => next(e));
}

function get(req, res) {
    return res.json(req.sensor);
}

function create(req, res, next) {
    var instance = new Sensor(req.body);

    instance.saveAsync()
        .then(sensor => res.json(sensor))
        .error(next);
}

function update(req, res, next) {
    Sensor.findByIdAndUpdateAsync(req.params.id, req.body, {
        new: true
    })
        .then(sensor => res.json(sensor))
        .error(next);
}

function remove(req, res, next) {
    Sensor.findByIdAndRemoveAsync(req.params.id, req.body)
        .then(sensor => {
            res.json(sensor);
            return next();
        })
        .error(next);
}

function query(req, res, next) {
    Sensor.findAsync({})
        .then(sensors => res.json(sensors))
        .error(next);
}

export default {load, get, create, update, query, remove};
