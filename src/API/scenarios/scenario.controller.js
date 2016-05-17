import Scenario from '../../scenarios/scenario.model';

function get(req, res) {
    return res.json(req.scenario);
}

function query(req, res, next) {
    Scenario.findAsync({})
        .then(scenarios => {
            res.json(scenarios);
            next();
        })
        .error(next);
}

function load(req, res, next, id) {
    Scenario.get(id).then((scenario) => {
        req.scenario = scenario;
        return next();
    }).error((e) => next(e));
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

export default {get, query, load, create, update};
