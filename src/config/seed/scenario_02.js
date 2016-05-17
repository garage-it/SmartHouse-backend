export default `
// TODO: calibrate
var THRESHOLD = 700;
var SHIFT = 10;
var INPUT_DEVICE_ID = 'light';
var OUTPUT_DEVICE_ID = 'GPIO3';

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
        return 'OFF';
    }

    if (input_value < (THRESHOLD - SHIFT/2)) {
        return 'ON';
    }
}

function handle(value){
    stream.output({ device: OUTPUT_DEVICE_ID, value: value });
}
`;