export default {
    env: 'production',
    db: process.env.MONGO,
    port: process.env.PORT,
    host: '0.0.0.0',
    seedDB: true,
    staticPath: process.env.PATH_FRONTENT_DIST,
    plugAndPlay: false,
    mqtt: {
        port: process.env.MQTT_PORT,
        hostname: process.env.MQTT_HOST_NAME,
        username: process.env.MQTT_USER_NAME,
        password: process.env.MQTT_PASSWORD
    }
};
