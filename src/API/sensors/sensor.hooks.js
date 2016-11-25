import Dashboard from '../dashboard/dashboard.model';

export default {createHooks};

function createHooks(sensorSchema) {
    sensorSchema.post('save', (sensor, next) => {
        Dashboard
            .findOneAndUpdate({}, {$push: {devices: sensor._id}}, next);

    });

    sensorSchema.post('remove', (sensor, next) => {
        Dashboard
            .findOneAndUpdate({}, {$pull: {devices: sensor._id}}, next);
    });
}
