/**
 * Populate DB with sample data on server start
 * to disable, edit config/env/%environment%.js, and set `seedDB: false`
 */

'use strict';

import { populateScenarios } from './scenarios';
import { populateDevices } from './devices';

export { populateDevices as populateSensors, populateScenarios };
