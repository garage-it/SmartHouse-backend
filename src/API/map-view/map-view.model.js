import moongose from 'mongoose';

/**
 * MapView Schema
 */
export default moongose.model('MapView', new moongose.Schema({
    pictureName: String,
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
