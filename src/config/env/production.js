export default {
    env: 'production',
    db: process.env.SH_MONGO_DB,
    port: process.env.SH_WEB_PORT,
    host: '0.0.0.0',
    seedDB: true,
    staticPath: process.env.SH_PATH_FRONTENT_DIST,
    plugAndPlay: false,
    mqtt: {
        port: process.env.SH_MQTT_PORT,
        hostname: process.env.SH_MQTT_HOST_NAME,
        username: process.env.SH_MQTT_USER_NAME,
        password: process.env.SH_MQTT_PASSWORD
    }
};
