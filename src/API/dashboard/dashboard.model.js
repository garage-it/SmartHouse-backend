import mongoose from 'mongoose';

/**
 * Dashboard Schema
 */

const DashboardSchema = new mongoose.Schema({
    devices: [{
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sensor'
        },
        hidden: {
            type: Boolean,
            default: false
        }
    }]
});

export default mongoose.model('Dashboard', DashboardSchema);
