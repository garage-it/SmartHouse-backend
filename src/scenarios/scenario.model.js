import Promise from 'bluebird';
import mongoose from 'mongoose';
import { start, stop } from './scenario.manager';

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
     * @returns {Promise<Sensor, undefined>}
     */
    get(id) {
        return this.findById(id)
            .execAsync().then((scenario) => {
                if (scenario) {
                    return scenario;
                }

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
    start(doc);
});

ScenarioSchema.post('remove', function(scenario){
    stop(scenario);
});

export default mongoose.model('Scenario', ScenarioSchema);
