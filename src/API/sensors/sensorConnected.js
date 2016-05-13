import request from 'supertest-as-promised';
import {stream} from '../../data-streams/input';
import app from '../../index';

const DEVICE_CONNECTED_EVENT = 'device-connected';

export default function(){
    stream
        .filter(message => message.event === DEVICE_CONNECTED_EVENT)
        .subscribe(onSuccess, onError, onComplete);

    function onSuccess(data) {
        request(app)
            .post('/api/sensors')
            .send(data)
            .then(onSensorAdded, onError);
    }

    function onSensorAdded () {
        //console.log('Sensor added!!!')
    }

    function onError(/*error*/) {
       //console.log(error);
    }

    function onComplete() {
        //console.log('Done!');
    }
}