import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import timeSeriesService from './timeseries.service';
import moment from 'moment';

const CHILD_PERIODS = {
    'day': 'hour',
    'week': 'day',
    'month': 'day',
    'year': 'month'
};

function query(req, res, next) {

    if (!req.query.period || ! CHILD_PERIODS.hasOwnProperty(req.query.period)) {
        const err = new APIError('Period is not provided to wrong', httpStatus.BAD_REQUEST);
        return next(err);
    }

    if (!req.query.sensor) {
        const err = new APIError('Sensor is not provided', httpStatus.BAD_REQUEST);
        return next(err);
    }

    const {sensor, period} = req.query;
    const devices = timeSeriesService.getDevicesStatistic();
    const from = moment().subtract(1, period);

    devices[sensor].getCollection(from.toDate(), CHILD_PERIODS[period]).toArray()
        .then(data => {
            res.json({
                sensor,
                data: data.map(item => ({ date: item.startDate, value: item.data.average }))
            });
        })
        .catch(next);
}

export default { query };
