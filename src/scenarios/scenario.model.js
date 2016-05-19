import Promise from 'bluebird';
import mongoose from 'mongoose';
// import httpStatus from 'http-status';
// import APIError from '../helpers/APIError';
import { run } from './runner';

/**
 * Scenario Schema
 */

const ScenarioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    active: {
        type: Boolean,
        default: false
    },
    body: String
});

/**
 * Methods
 */
ScenarioSchema.method({});

/**
 * Statics
 */
ScenarioSchema.statics = {
    /**
     * Get sensor
     * @param {ObjectId} id - The objectId of scenario.
     * @returns {Promise<Sensor, APIError>}
     */
    get(id) {
        return this.findById(id)
            .execAsync().then((scenario) => {
                if (scenario) {
                    return scenario;
                }
                // const err = new APIError('No such scenario exists!', httpStatus.NOT_FOUND);
                // return Promise.reject(err);

                return Promise.reject();
            });
    }
};

ScenarioSchema.options.toJSON = ScenarioSchema.options.toObject = {
    transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        ret.id = doc._id.toString();
        return ret;
    }
};

ScenarioSchema.post('save', function(doc) {
    run(doc);
});

export default mongoose.model('Scenario', ScenarioSchema);