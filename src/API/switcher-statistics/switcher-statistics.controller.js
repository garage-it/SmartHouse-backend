import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

//TODO: should be moved to constant and reused in timeseries.
//Correct constant would have hour, day, month and year properties
const PERIOD_TO_INTERVAL = {
    'day': 60,
    'week': 60*24,
    'month': 60*24,
    'year': 60*24*30
};

function query(req, res, next) {
    if (!req.query.period || ! PERIOD_TO_INTERVAL.hasOwnProperty(req.query.period)) {
        const err = new APIError('Period is not provided or wrong', httpStatus.BAD_REQUEST);
        return next(err);
    }

    if (!req.query.sensor) {
        const err = new APIError('Sensor is not provided', httpStatus.BAD_REQUEST);
        return next(err);
    }

    const data = [{
        name: 'Time ON',
        value: Math.floor((Math.random() * 100) + 1)
    }, {
        name: 'Time OFF',
        value: Math.floor((Math.random() * 100) + 1)
    }];

    res.json({data});
}

export default { query };
