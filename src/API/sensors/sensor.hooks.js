import Dashboard from '../dashboard/dashboard.model';

export default {createHooks};

function createHooks(sensorSchema) {

    sensorSchema.pre('save', function (next) {
        this.wasNew = this.isNew;
        next();
    });

    sensorSchema.post('save', function(sensor, next) {
        if (this.wasNew) {
            Dashboard.findOneAndUpdate({},{$push: {devices: {
                device: sensor._id.toString()
            }}}, next);
        }
    });

    sensorSchema.post('remove', (sensor, next) => {
        Dashboard
            .findOneAndUpdate({}, {$pull: {devices: {
                device: sensor._id.toString()
            }}}, next);
    });
}
