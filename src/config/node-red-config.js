import RED from 'node-red';

export default {
    settings: {
        httpAdminRoot: '/node_red',
        httpNodeRoot: '/node_red_api',
        userDir:'/home/nol/.nodered/',
        functionGlobalContext: {} // enables global context
    },

    init: function(server = {}) {
        RED.init(server, this.settings);
    },

    useRoutes(app) {
        // TODO: to get rid of this hack
        this.init();

        // Serve the editor UI from /node_red
        app.use(this.settings.httpAdminRoot, RED.httpAdmin);

        // Serve the http nodes UI from /node_red_api
        app.use(this.settings.httpNodeRoot, RED.httpNode);
    },

    start: function() {
        return RED.start();
    }
};
