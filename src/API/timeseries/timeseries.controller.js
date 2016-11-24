import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import moment from 'moment';

const PERIOD_TO_INTERVAL = {
    'day': 60,
    'week': 60*24,
    'month': 60*24,
    'year': 60*24*30
};

function query(req, res, next) {

    if (!req.query.period || ! PERIOD_TO_INTERVAL.hasOwnProperty(req.query.period)) {
        const err = new APIError('Period is not provided to wrong', httpStatus.BAD_REQUEST);
        return next(err);
    }

    if (!req.query.sensor) {
        const err = new APIError('Sensor is not provided', httpStatus.BAD_REQUEST);
        return next(err);
    }

    const {sensor, period} = req.query;
    const stepMin = PERIOD_TO_INTERVAL[period];
    const from = moment();
    const to = from.clone();

    // Period
    switch (period) {
    case 'day':
        from.subtract(1, 'day');
        break;
    case 'week':
        from.subtract(7, 'day');
        break;
    case 'month':
        from.subtract(1, 'month');
        break;
    case 'year':
        from.subtract(1, 'year');
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

    data.reverse();

    res.json({
        from,
        to,
        sensor,
        stepMin,
        data
    });
}

export default { query };
