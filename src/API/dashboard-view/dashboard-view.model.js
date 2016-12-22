import mongoose from 'mongoose';
import SensorModel from '../sensors/sensor.model';

const DashboardViewSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: false,
        required: true
    },
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: SensorModel
    }]
});

export default mongoose.model('DashboardView', DashboardViewSchema);
