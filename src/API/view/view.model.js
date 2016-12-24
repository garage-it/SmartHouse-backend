import mongoose from 'mongoose';
import DashboardViewModel from '../dashboard-view/dashboard-view.model';
import MapViewModel from '../map-view/map-view.model';

const ViewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    defaultSubview: {
        type: String,
        required: true
    },
    dashboardSubview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DashboardViewModel,
        required: false
    },
    mapSubview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MapViewModel,
        required: false
    }
});

export default mongoose.model('View', ViewSchema);
