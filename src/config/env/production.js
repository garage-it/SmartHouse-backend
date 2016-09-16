export default {
    env: 'production',
    db: 'mongodb://localhost/db',
    port: process.env.SH_BACKEND_PORT || 3000,
    host: '0.0.0.0',
    seedDB: true,
    staticPath: process.env.SH_PATH_FRONTENT_DIST,
    plugAndPlay: false,
    mqtt: {
        port: 1883,
        hostname: 'localhost',
        username: 'USERNAME',
        password: 'PASSWORD'
    }
};
