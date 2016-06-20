import ScenarioConverter from '../../scenarios/scenario.converter.js';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

function getConvertedScenario(req, res, next) {
    ScenarioConverter
        .convertScenario(req.query.scenarioConfig)
        .then((scenarioJS) => res.json(scenarioJS))
        .catch((errorMessage) => {
            const err = new APIError(errorMessage, httpStatus.BAD_REQUEST);

            return next(err);
        });
}

export default {getConvertedScenario};
