import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import sensorHooks from './sensor.hooks';

/**
 * Sensor Schema
 */

const SensorSchema = new mongoose.Schema({
    description: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    executor: {
        type: Boolean,
        default: false
    },
    metrics: {
        type: String,
        require: true
    },
    mqttId: {
        type: 'String',
        unique : true,
        require: true
    }
});

/**
 * Methods
 */
SensorSchema.method({
});

/**
 * Statics
 */
SensorSchema.statics = {
    /**
     * Get sensor
     * @param {ObjectId} id - The objectId of sensor.
     * @returns {Promise<Sensor, APIError>}
     */
    get(id) {
        return this.findById(id)
            .execAsync().then((sensor) => {
                if (sensor) {
                    return sensor;
                }
                const err = new APIError('No such sensor exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    }
};

sensorHooks.createHooks(SensorSchema);

export default mongoose.model('Sensor', SensorSchema);
