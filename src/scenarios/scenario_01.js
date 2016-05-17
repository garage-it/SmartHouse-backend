/*eslint-disable */
export default `
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
    }
`;