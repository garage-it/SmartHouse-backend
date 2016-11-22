import path from 'path';

export default {
    env: 'test',
    db: 'mongodb://localhost/db',
    port: 3001,
    host: '',
    seedDB: false,
    filesPath: path.join(__dirname, '/../../../test/files'),
    plugAndPlay: false,
    mqtt: {
        port: 1883,
        host: 'sputnik',
        user: 'UsErNaMe',
        pass: 'PaSsWoRd'
    }
};
