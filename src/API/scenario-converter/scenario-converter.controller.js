import ScenarioConverter from '../../scenarios/scenario.converter.js';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

function getConvertedScenario(req, res, next) {
    if (!req.query.scenarioConfig) {
        const err = new APIError('No scenario JSON received!', httpStatus.BAD_REQUEST);

        return next(err);
    }

    const scenarioConfig = JSON.parse(req.query.scenarioConfig);

    res.json(ScenarioConverter.convertScenario(scenarioConfig));
}

export default {getConvertedScenario};
