import mongoose from 'mongoose';

/**
 * Dashboard Schema
 */

const DashboardSchema = new mongoose.Schema({
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor'
    }]
});

export default mongoose.model('Dashboard', DashboardSchema);