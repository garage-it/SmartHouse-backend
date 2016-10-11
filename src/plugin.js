const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const commanderPath = path.resolve(__dirname + '/commander.js');

module.exports = function(config) {
    // context
    return function(context) {
        const plugin = {};
        Object.assign(plugin, {
            name: 'smart-house-backend',
            init: _init.bind(plugin, config, context),
            start: _start.bind(plugin, config, context),
            stop: _stop.bind(plugin, config, context),
            destroy: function() {}
        });
        return plugin;
    };
};

function _init(/*config, context*/) {

    return new Promise(function(resolve, reject) {
        fs.stat(commanderPath, function(err) {
            if (err) {
                reject('File does not exist: ' + commanderPath);
                return;
            }
            resolve();
        });
    });
}

function _start(config, context) {
    // Default configuration
    const defaults = {
        HOST: '0.0.0.0',
        PLUG_AND_PLAY: true,
        SEED_DB: false,
        MONGO: 'mongodb://localhost/db',
        BACKEND_PORT: '8080',
        MQTT_PORT: '1883',
        MQTT_HOST_NAME: 'localhost',
        MQTT_USER_NAME: 'USERNAME',
        MQTT_PASSWORD: 'PASSWORD',
        PATH_FRONTENT_DIST: ''
    };

    const configuration = Object.assign({}, config,  context.getConfig(), configuration);
    return context.startScript(this.name, commanderPath, 'start', _.pick(configuration, Object.keys(defaults)));
}

function _stop(config, context) {
    return context.stopScript(this.name, commanderPath);
}
