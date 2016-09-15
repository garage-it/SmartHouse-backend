export default {
    env: 'production',
    db: 'mongodb://localhost/db',
    port: 3000,
    host: '0.0.0.0',
    seedDB: true,
    staticPath: process.env.SH_WEB_FRONTEND_DIST,
    plugAndPlay: false,
    mqtt: {
        port: 1883,
        hostname: 'localhost',
        username: 'USERNAME',
        password: 'PASSWORD'
    }
};
