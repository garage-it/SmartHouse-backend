export default {
    env: 'heroku',
    db: process.env.MONGO,
    port: process.env.PORT,
    seedDB: true,
    plugAndPlay: false,
    mqtt: {
        port: process.env.MQTT_PORT,
        hostname: process.env.MQTT_HOST_NAME,
        username: process.env.MQTT_USER_NAME,
        password: process.env.MQTT_PASSWORD
    }
};
