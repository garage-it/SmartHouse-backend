import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {expect} from 'chai';
import proxyquire from 'proxyquire';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('Scenario Runner', () => {
    beforeEach(function () {
        sinon.spy(process, 'on');
        process.send = sinon.stub();
    });

    describe('Starting vm', ()=>{
        let mockVm;

        beforeEach(function () {
            mockVm = {
                runInNewContext: sinon.stub()
            };

            proxyquire('./runner', {
                'vm': mockVm
            });
        });

        it('will start script execution', function () {
            let script = 'allert()';

            process.on.callArgWith(1, {
                type: 'start',
                content: script
            });

            expect(mockVm.runInNewContext).to.have.been.calledWith(script);
        });
    });

    describe('#Messaging', function () {
        beforeEach(function () {
            let scenarioApiManager = {
                create: function(inputStream, outputStream){
                    return {
                        fake_input: inputStream,
                        fake_output: outputStream
                    };
                }
            };

            proxyquire('./runner', {
                './scenario-api.manager': scenarioApiManager
            });
        });

        it('will send a output to parent process', () => {
            let message = 'asd';

            let script = `SMART_HOUSE.fake_output.next('${message}')`;

            process.on.callArgWith(1, {
                type: 'start',
                content: script
            });

            expect(process.send).to.have.been.calledWith({
                type: 'message',
                content: message
            });
        });

        it('will subscribe for input events', function () {
            let message = 'asd';

            let script = `
                    SMART_HOUSE
                        .fake_input
                        .subscribe(SMART_HOUSE.fake_output.next.bind(SMART_HOUSE.fake_output))
                `;

            process.on.callArgWith(1, {
                type: 'start',
                content: script
            });

            process.on.callArgWith(1, {
                type: 'message',
                content: message
            });

            expect(process.send).to.have.been.calledWith({
                type: 'message',
                content: message
            });

        });

    });

    afterEach(() => {
        process.on.restore();
    });

});
