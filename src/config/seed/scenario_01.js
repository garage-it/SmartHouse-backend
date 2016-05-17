export default `
// TODO: calibrate
var THRESHOLD = 29;
var SHIFT = 0.2;
var INPUT_DEVICE_ID = 'temperature';
var OUTPUT_DEVICE_ID = 'GPIO2';

stream
    .input
    .filter(e=>e.device === INPUT_DEVICE_ID)
    .map(getNewState)
    .filter(v=>!!v)
    .distinctUntilChanged()
    .subscribe(handle);

function getNewState(event) {
    var input_value = Number.parseInt(event.value);
    if (input_value > (THRESHOLD + SHIFT/2)) {
        return 'ON';
    }

    if (input_value < (THRESHOLD - SHIFT/2)) {
        return 'OFF';
    }
}

function handle(value){
    stream.output({ device: OUTPUT_DEVICE_ID, value: value });
}
`;
