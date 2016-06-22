import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {expect} from 'chai';
import proxyquire from 'proxyquire';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('Scenario Runner', () => {
    before(function () {
        process.send = sinon.stub();
    });

    it('will start script execution', function () {
        const mockVm = {
            runInNewContext: sinon.stub()
        };
        const script = 'alert()';

        process.argv[2] = script;

        proxyquire('./runner', {
            'vm': mockVm
        });

        expect(mockVm.runInNewContext).to.have.been.calledWith(script);
    });

    it('will send a output to parent process', () => {
        let message = 'asd';

        let script = `SMART_HOUSE.fake_output.next('${message}')`;

        let scenarioApiManager = {
            create: function (inputStream, outputStream) {
                return {
                    fake_input: inputStream,
                    fake_output: outputStream
                };
            }
        };

        process.argv[2] = script;

        proxyquire('./runner', {
            './scenario-api.manager': scenarioApiManager
        });

        expect(process.send).to.have.been.calledWith({
            type: 'message',
            content: message
        });
    });
});
