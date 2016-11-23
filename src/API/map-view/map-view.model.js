import moongose from 'mongoose';

/**
 * MapView Schema
 */
export default moongose.model('MapView', new moongose.Schema({
    pictureName: String,
    name: String,
    description: String,
    active: {
        type: Boolean,
        default: false
    },
    sensors: [{
        sensor: {
            type: moongose.Schema.Types.ObjectId,
            ref: 'Sensor'
        },
        position: {
            x: Number,
            y: Number
        }
    }]
}));
