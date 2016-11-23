export default {
    env: 'development',
    db: 'mongodb://localhost/db',
    port: 3000,
    host: '',
    publicUrl: 'http://localhost:3000',
    seedDB: true,
    staticPath: process.env.PATH_FRONTENT_DIST || '',
    plugAndPlay: false,
    mqtt: {
        port: 1883,
        hostname: 'localhost',
        username: 'USERNAME',
        password: 'PASSWORD'
    }
};
