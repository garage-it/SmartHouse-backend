import Dashboard from '../dashboard/dashboard.model';

export default {createHooks};

function createHooks(sensorSchema) {
    sensorSchema.post('save', (sensor) => {
        Dashboard
            .create({device: sensor._id.toString()});
    });

    sensorSchema.post('remove', (sensor) => {
        Dashboard
            .findOneAndRemove({device: sensor._id.toString()})
            .exec();
    });
}
