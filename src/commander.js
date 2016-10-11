// ES6 + support
require('babel-register');

const run = require('./app');
const program = require('commander');

// Init program version
program.version('0.0.0.1');

program
    .command('start [options]')
    .description('Start the backend')
    .option('--MONGO [value]', 'MongoDb connection point')
    .option('--BACKEND_PORT [value]', 'Port to serve data to')
    .option('--HOST [value]', 'Host to serve the backend e.g. 0.0.0.0')
    .option('--SEED_DB', 'Activare seeds db')

    .option('--PLUG_AND_PLAY', 'Turn on plug and play option')

    .option('--MQTT_PORT [value]', 'MQTT port')
    .option('--MQTT_HOST_NAME [value]', 'MQTT host name')
    .option('--MQTT_USER_NAME [value]', 'MQTT user name')
    .option('--MQTT_PASSWORD [value]', 'MQTT password')
    .option('--PATH_FRONTENT_DIST [value]', 'static directory path')
    .action(function(cmd, options) {
        // run program (take options from param then env varribes, and default)
        var cfg = {
            env: 'production',
            db: options['MONGO'] || process.env['MONGO'] || 'mongodb://localhost/db',
            port: options['BACKEND_PORT'] || process.env['PORT'] || 3000,
            host: options['HOST'] || '0.0.0.0',
            seedDB: !!options['SEED_DB'],
            plugAndPlay: !!options['PLUG_AND_PLAY'],
            staticPath: options['PATH_FRONTENT_DIST'] || process.env['PATH_FRONTENT_DIST'],
            mqtt: {
                port: options['MQTT_PORT'] || process.env['MQTT_PORT'] || 1883,
                hostname: options['MQTT_HOST_NAME'] || process.env['MQTT_HOST_NAME'] || 'localhost',
                username: options['MQTT_USER_NAME'] || process.env['MQTT_USER_NAME'] || 'USERNAME',
                password: options['MQTT_PASSWORD'] || process.env['MQTT_PASSWORD'] || 'PASSWORD'
            }
        };
                
        run(cfg);
    });



// Process Argv
program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
