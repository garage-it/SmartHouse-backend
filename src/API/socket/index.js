import scenarioApi from './scenario-events';
import deviceApi from './device-events';

export default function (io) {
    scenarioApi(io);
    deviceApi(io);
}