/*eslint-disable */
const scenario_body = `
console.log('HELLO SCRIPT WORLD');
stream
    .input
    .filter(d=>d.device === 'iddqd')
    .subscribe(write);

function write(event){
    console.log('Heey, somethings just happened', event);
    stream.output(
        'event',
        {
            device: 'lamp',
            data: 'ON'
        }
    );
}`;

export default {
    name: 'Simple script',
    description: 'will do something when something happens',
    body: scenario_body
};
