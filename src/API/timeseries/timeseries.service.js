import input from '../../data-streams/input';
import Debugger from 'debug';
import { Caiman } from 'caiman';
import { MongoClient } from 'mongodb';
import config from '../../config/env';
import Promise from 'bluebird';
Promise.promisifyAll(MongoClient);

const debug = Debugger('SH_BE:new-device-handler');
const STATUS_EVENT = 'status';
const STRATEGY = 'averages';
const periods = ['month', 'day', 'hour', 'minute', 'second'];
const devicesStatistic = {};
const options = {
    driver: {
        type: 'mongodb',
        options: {}
    }
};

export default {
    saveStatisticToDB,
    getDevicesStatistic
};

function saveStatisticToDB() {
    MongoClient.connect(config.db, (err, db) => {
        options.driver.options.db = db;

        input.stream
            .filter(message => message.event === STATUS_EVENT)
            .subscribe(saveData, error => debug(`Error: '${error}' occured`));

        function saveData({ device, value }) {
            if (!devicesStatistic[device]) {
                devicesStatistic[device] = new Caiman(device, options);
            }
            saveDataWithCaiman(device, value);
        }

        function saveDataWithCaiman(device, value){
            const currentDate = new Date();
            devicesStatistic[device].save(currentDate, periods, value, STRATEGY);
        }
    });
}

function getDevicesStatistic() {
    return devicesStatistic;
}