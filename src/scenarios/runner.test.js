import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Scenario Runner', () => {
    let sut;

    let output_stream;
    let input_stream;

    beforeEach(function(){
        output_stream = {
            write: sinon.spy()
        };

        input_stream = {};

        sut = proxyquire('./runner', {
            '../data-streams/output': output_stream,
            '../data-streams/input':  input_stream
        });
    });

    it('will execute script', function(){
        const message = 'testo';

        const mock_script = {
            name: 'mock script',
            body: `stream.output('${ message }')`
        };

        sut.run(mock_script);
        expect(output_stream.write).to.have.been.calledWith(message);
    });

});