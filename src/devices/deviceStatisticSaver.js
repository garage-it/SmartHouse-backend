import input from '../data-streams/input';
import Debugger from 'debug';
import {Caiman} from '../caiman';

console.log(Caiman);

const debug = Debugger('SH_BE:new-device-handler');
const DEVICE_STATUS_EVENT = 'status';
const STRATEGY = 'averages';
console.log('device statistics will be here');

const statisticSavers = {};
const periods = ['month', 'day', 'hour', 'minute'];
const options = {
    driver: {
        type: 'files',
        options:{
            path: '/tmp/'
        }
    }
};

export default function saveDeviceStatistic() {
    console.log('device statistic');
    input.stream
        .filter(message => message.event === DEVICE_STATUS_EVENT)
        .subscribe(saveInfo, onError);

    function saveInfo (data) {
        console.log(data);
        if (!statisticSavers[data.device]) {
            console.log('new statistic saver');
            statisticSavers[data.device] = new Caiman(data.device, options);
        } else {
            console.log('exisiting statistic saver');
        }
        saveInfoWithCaiman(data);
    }

    function onError(error) {
        debug(`Error: '${error}' occured`);
    }

    function saveInfoWithCaiman({device, value}){
        console.log('saved');
        let currentDate = new Date();
        statisticSavers[device].save(currentDate, periods, value, STRATEGY);
    }
}