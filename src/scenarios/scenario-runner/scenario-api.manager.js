/**
* @file Provides particular version of script API
*
* @example
* // get API instance
* <this>
*   .create(input: Rx.Stream, output: Rx.Stream)
*   .get_api('0.0.1')
*   .then(function(api){
*       // subscribe to events from particular devices
*       api.on('message', ['device_01', 'device_02'], function(){
*           // calculate new state when any of values have changed
*           if (
*               api.device.get('device_01').value > 0
*           &&  api.device.get('device_02').value == 'ON'
*           ) {
*               api.device.get('device_03').send('OFF');
*           }
*       });
*   });
*
*/

'use strict';

function create(inputStream, outputStream){
    let devicesStorage = new Map();

    setUpDeviceListeners();

    // NOTE: this is 0.0.1 only version of the api
    return { get_api };

    function setUpDeviceListeners(){
        inputStream
            .subscribe(handleSystemEvent);

        function handleSystemEvent (event){
            if (!event){
                return;
            }

            let device = getDevice(event.device);

            if (!device){
                return;
            }

            device.value = event.value;
        }
    }

    function getDevice(deviceId){
        if (!deviceId){
            return;
        }

        let device;
        if (devicesStorage.has(deviceId)){
            device = devicesStorage.get(deviceId);
        } else {
            device = createDevice(deviceId);
            devicesStorage.set(deviceId, device);
        }
        return device;
    }

    function createDevice(deviceId){
        return {
            send
        };

        function send(outValue){
            outputStream.next({
                device: deviceId,
                value: outValue
            });
        }
    }


    function get_api(version){
        if (version === '0.0.1'){
            const api = create_api();
            api.version = version;
            return Promise.resolve(api);
        }

        return Promise.reject('This version of client script API is not supported');

        function create_api(){

            return {
                stream: {
                    input: inputStream,
                    output: outputStream.next.bind(outputStream)
                },
                on: onHandler,
                device: {
                    get: getDevice
                }
            };

            function onHandler(eventName, devices, cb){
                if (eventName === 'message') {
                    inputStream
                        .filter(event=>devices.indexOf(event.device)>=0)
                        .subscribe(cb);

                    return;
                }

                throw 'No such event is present';
            }
        }
    }
}

module.exports = { create };