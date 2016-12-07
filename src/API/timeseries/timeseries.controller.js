import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import timeSeriesService from './timeseries.service';

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
    const devices = timeSeriesService.getDevicesStatistic();
    
    const data = [];

    devices[sensor].getCollection(new Date(), period).each( (err, item) => {
        if(item) {
            data.push({
                date: item.startDate,
                value: item.data.n
            });

        } else {
            res.json({
                sensor,
                data
            });
        }
    });
}

export default { query };
