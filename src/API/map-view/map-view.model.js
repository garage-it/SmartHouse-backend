import moongose from 'mongoose';
import SensorModel from '../sensors/sensor.model';


const PositionSchema = {
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    }
};

const SensorPositionSchema = {
    sensor: {
        type: moongose.Schema.Types.ObjectId,
        ref: SensorModel,
        required: true
    },
    position: {
        type: PositionSchema,
        required: true
    }
};

export default moongose.model('MapView', new moongose.Schema({
    pictureName: {
        type: String,
        default: '',
        required: false
    },
    name: {
        type: String,
        default: '',
        required: true
    },
    description: {
        type: String,
        default: '',
        required: true
    },
    active: {
        type: Boolean,
        default: false,
        required: true
    },
    sensors: [SensorPositionSchema]
}));
