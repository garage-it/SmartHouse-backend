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
    default: {
        type: String,
        required: true
    },
    dashboardSubview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DashboardViewModel,
        required: true
    },
    mapSubview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MapViewModel,
        required: true
    }
});

export default mongoose.model('View', ViewSchema);
