import httpStatus from 'http-status';
import Scenario from '../../scenarios/scenario.model';
import APIError from '../helpers/APIError';

function get(req, res) {
    return res.json(req.scenario);
}

function query(req, res, next) {
    Scenario.findAsync({})
        .then((scenarios) => res.json(scenarios))
        .error(next);
}

function load(req, res, next, id) {
    Scenario.get(id).then((scenario) => {
        req.scenario = scenario;
        return next();
    }).error(() => {
        const err = new APIError('No such scenario exists!', httpStatus.NOT_FOUND);
        return next(err);
    });
}

function create(req, res, next) {
    var instance = new Scenario(req.body);

    instance.saveAsync()
        .then(scenario => res.json(scenario))
        .error(next);
}

function update(req, res, next) {
    delete req.body.id;
    Object.assign(req.scenario, req.body);
    req.scenario.saveAsync()
        .then(() => res.json(req.scenario))
        .error(next);
}

function remove(req, res, next) {
    req.scenario.removeAsync()
        .then(sensor => {
            res.json(sensor);
            return next();
        })
        .error(next);
}

export default {get, query, load, create, update, remove};
