import mongoose from 'mongoose';

const ViewSchema = new mongoose.Schema({
    dashboard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dashboard'
    },
    mapView: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MapView'
    }
});

export default mongoose.model('View', ViewSchema);
