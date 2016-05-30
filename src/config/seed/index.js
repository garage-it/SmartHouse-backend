/**
 * Populate DB with sample data on server start
 * to disable, edit config/env/%environment%.js, and set `seedDB: false`
 */

'use strict';

import { scenarios, populateScenarios } from './scenarios';
import { devices, populateDevices } from './devices';

const seedData = {
    sensors: devices.map(dev=>dev.toObject()), // TODO: rename sensors to devices
    scenarios: scenarios.map(s=>s.toObject())
};

export { populateDevices as populateSensors, populateScenarios, seedData };
