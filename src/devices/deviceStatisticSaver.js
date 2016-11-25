import input from '../data-streams/input';
import Debugger from 'debug';
import {Caiman} from 'caiman';
import mongoose from 'mongoose';
import {MongoClient} from 'mongodb';
import config from '../config/env';

const debug = Debugger('SH_BE:new-device-handler');
const DEVICE_STATUS_EVENT = 'status';
const STRATEGY = 'averages';

const statisticSavers = {};
const periods = ['month', 'day', 'hour', 'minute'];

const options = {
    driver: {
        type: 'mongodb',
        options: {}
    }
};

console.log(mongoose);

export default function saveDeviceStatistic() {
    MongoClient.connect(config.db, (err, db) => {
        options.driver.options.db = db;
        console.log('connected');

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
    });
}