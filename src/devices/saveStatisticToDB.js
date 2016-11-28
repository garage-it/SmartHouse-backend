import input from '../data-streams/input';
import Debugger from 'debug';
import { Caiman } from 'caiman';
import { MongoClient } from 'mongodb';
import config from '../config/env';

const debug = Debugger('SH_BE:new-device-handler');
const STATUS_EVENT = 'status';
const STRATEGY = 'averages';
const periods = ['month', 'day', 'hour', 'minute', 'second'];
const options = {
    driver: {
        type: 'mongodb',
        options: {}
    }
};

export default function saveStatisticToDB(statisticSavers = {}) {
    MongoClient.connect(config.db, (err, db) => {
        options.driver.options.db = db;

        input.stream
            .filter(message => message.event === STATUS_EVENT)
            .subscribe(saveData, error => debug(`Error: '${error}' occured`));

        function saveData({ device, value }) {
            if (!statisticSavers[device]) {
                statisticSavers[device] = new Caiman(device, options);
            }
            saveDataWithCaiman(device, value);
        }

        function saveDataWithCaiman(device, value){
            const currentDate = new Date();
            statisticSavers[device].save(currentDate, periods, value, STRATEGY);
        }
    });
}