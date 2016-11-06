'use strict';

import mongoose from 'mongoose';
import {ALL_EVENT_TYPES} from './event/event-type';

/**
 * Device Statistic Schema
 */

// NOTE: we can consider to use capped collection to limit the size of statistic collection
// see - http://mongoosejs.com/docs/guide.html#capped and https://docs.mongodb.com/manual/core/capped-collections/

// NOTE: we are using object _id as timestamp property
// for additional details see - https://steveridout.github.io/mongo-object-time/ , http://stackoverflow.com/questions/8749971/can-i-query-mongodb-objectid-by-date
const DeviceStatisticSchema = new mongoose.Schema({
    'event': {
        'type': String,
        'enum': ALL_EVENT_TYPES
    },
    'device': {
        'type': String
    },
    'value': {
        'type': Object
    }
});

// TODO: Consider index options

export default mongoose.model('Device_Statistic', DeviceStatisticSchema);
