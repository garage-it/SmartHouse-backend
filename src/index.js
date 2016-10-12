import config from './config/env';

// Get the runner
const run = require('./app');

// Run the application
const app = run(config);

export default app;
