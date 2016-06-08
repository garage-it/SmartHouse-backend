import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Promise from 'bluebird';

/**
 * Dashboard Schema
 */

const DashboardSchema = new mongoose.Schema({
    widgets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor'
    }]
});


/**
 * Statics
 */
DashboardSchema.statics = {
    /**
     * Get dashboard
     * @param {ObjectId} id - The id of the dashboard.
     * @returns {Promise<Dashboard, APIError>}
     */
    get(id) {
        return this.findById(id)
            .execAsync()
            .then(dashboard => {
                if (dashboard) {
                    return dashboard;
                }
                const err = new APIError('No such dashboard exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    }
};

export default mongoose.model('Dashboard', DashboardSchema);