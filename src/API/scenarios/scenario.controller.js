import Scenario from './scenario.model';

function get(req, res, next) {
    Scenario.get(req.params.id).then((scenario) => {
        res.json(scenario);
        return next();
    }).error(next);
}

function query(req, res, next) {
    Scenario.findAsync({})
        .then(scenarios => {
            res.json(scenarios);
            next();
        })
        .error(next);
}

export default {get, query};
