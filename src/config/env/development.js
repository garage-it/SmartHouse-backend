export default {
    env: 'development',
    db: 'mongodb://localhost/db',
    port: 3000,
    seedDB: true,
    plugAndPlay: false,
    mqtt: {
        port: 1883,
        hostname: 'localhost',
        username: 'USERNAME',
        password: 'PASSWORD'
    }
};
