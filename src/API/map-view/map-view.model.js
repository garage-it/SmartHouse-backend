import moongose, { Schema } from 'mongoose';
import SensorModel from '../sensors/sensor.model';

/**
 * MapView Schema
 */
export default moongose.model('MapView', new Schema({
    pictureName: String,
    name: String,
    description: String,
    active: {
        type: Boolean,
        default: false
    },
    sensors: [{
        sensor: {
            type: Schema.Types.ObjectId,
            ref: SensorModel
        },
        position: {
            x: Number,
            y: Number
        }
    }]
}));
