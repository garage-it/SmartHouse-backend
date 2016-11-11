const PERIOD_TO_INTERVAL = {
    'day': 60,
    'week': 60,
    'month': 60*24,
    'year': 60*24
};

import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import moment from 'moment';

function query(req, res, next) {

    if (!req.query.period || ! PERIOD_TO_INTERVAL.hasOwnProperty(req.query.period)) {
        const err = new APIError('Period is not provided to wrong', httpStatus.BAD_REQUEST);
        return next(err);
    }

    if (!req.query.sensor) {
        const err = new APIError('Sensor is not provided', httpStatus.BAD_REQUEST);
        return next(err);
    }
    
    const sensor = req.query.sensor;
    const period = req.query.period;
    const stepMin = PERIOD_TO_INTERVAL[period];
    const from = moment();
    const to = from.clone();
    switch (period) {
        case 'day':
                from.subtract(1, 'd');
            break;
        case 'week':
                from.subtract(7, 'd');
            break;
        case 'month':
                from.subtract(1, 'm');
            break;
        case 'year':
                from.subtract(1, 'y');
            break;
    }
    const data = [];

    let current = to.clone();

    while (current >= from) {
        data.push({
            date: current.toString(),
            value: Math.floor(Math.random()*100)
        });
        current = current.subtract(stepMin, 'minutes');
    }

    res.json({
        from,
        to,
        sensor,
        stepMin,
        data
    });
}

export default { query };
