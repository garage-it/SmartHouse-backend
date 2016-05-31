import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import '../test/mongo';
import mongoose from 'mongoose';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Scenario Model', () => {
    let sut;
    let runner;

    beforeEach(function(){

        // NOTE: deleting 
        delete mongoose.models.Scenario;
        delete mongoose.modelSchemas.Scenario;

        runner = {
            run: sinon.spy()
        };

        sut = proxyquire('./scenario.model', {
            './runner': runner
        });
    });

    it('will execute script', function(done){
        const script = {
            name: 'test-name',
            body: 'console.log("test-body")'
        };

        const instance = new sut(script);

        instance.saveAsync()
            .then(()=>{
                expect(runner.run).to.have.been.calledWithMatch({
                    id: sinon.match.string,
                    active: sinon.match.bool,
                    name: script.name,
                    body: script.body
                });
                done();
            })
            .catch(done);

    });

});