'use strict';

import input from '../data-streams/input';
import Debugger from 'debug';
import {ALL_EVENT_TYPES} from './event/event-type';
import DeviceStatistic from './device-statistic.model';

const debug = Debugger('SH_BE:device-connected');

export default function() {
    input.stream.subscribe(saveStatistic, onError);
}

function saveStatistic(data) {
    if(ALL_EVENT_TYPES.includes(data.event)) {
        new DeviceStatistic(data).saveAsync(() => {}, onError);
    }
}

function onError(error) {
    debug(`Error: '${error}' occured`);
}