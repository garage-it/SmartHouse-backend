import DashboardView from '../dashboard-view/dashboard-view.model';

export default {createHooks};

function createHooks(sensorSchema) {

    sensorSchema.pre('save', function (next) {
        this.wasNew = this.isNew;
        next();
    });

    sensorSchema.post('save', function(sensor, next) {
        if (this.wasNew) {
            DashboardView
                .findOneAndUpdate({}, {$push: {devices: sensor._id}}, next);
        }
    });

    sensorSchema.post('remove', (sensor, next) => {
        DashboardView
            .findOneAndUpdate({}, {$pull: {devices: sensor._id}}, next);
    });
}
