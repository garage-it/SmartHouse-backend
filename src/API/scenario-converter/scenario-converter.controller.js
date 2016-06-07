import ScenarioConverter from '../../scenarios/scenario.converter.js';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

function getConvertedScenario(req, res, next) {
    if (!req.query.scenarioConfig) {
        const err = new APIError('No scenario JSON received!', httpStatus.BAD_REQUEST);

        return next(err);
    }

    const scenarioConfig = JSON.parse(req.query.scenarioConfig);

    if (!scenarioConfig.conditions || !scenarioConfig.actions || !scenarioConfig.logicalOperator) {
        const err = new APIError('Incorrect scenario JSON received!', httpStatus.BAD_REQUEST);

        return next(err);
    }

    res.json(ScenarioConverter.convertScenario(scenarioConfig));
}

export default {getConvertedScenario};
