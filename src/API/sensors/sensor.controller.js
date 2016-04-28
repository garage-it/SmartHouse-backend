import Sensor from './sensor.model';

function get(req, res, next) {
    Sensor.get(req.params.id).then((sensor) => {
        res.json(sensor);
        return next();
    }).error(next);
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
        .then(sensor => {
            res.json(sensor);
            return next();
        })
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
        .then(sensors => {
            res.json(sensors);
            next();
        })
        .error(next);
}

export default {get, create, update, query, remove};
