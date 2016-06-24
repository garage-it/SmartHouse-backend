import Dashboard from '../dashboard/dashboard.model';

export default {createHooks};

function createHooks(sensorSchema) {
    sensorSchema.post('save', (sensor, next) => {
        Dashboard
            .findOneAndUpdate({}, {$push: {devices: {
                device: sensor._id.toString()
            }}}, next);

    });

    sensorSchema.post('remove', (sensor, next) => {
        Dashboard
            .findOneAndUpdate({}, {$pull: {devices: {
                device: sensor._id.toString()
            }}}, next);
    });
}
