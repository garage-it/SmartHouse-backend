import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Promise from 'bluebird';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Scenario loader', () => {
    let Scenario;
    let mongoose;
    let scenarioManager;
    let promise;

    let scripts;

    beforeEach(function(){
        scripts = ['a', 'b', 'c'];

        scenarioManager = {
            start: sinon.spy()
        };

        promise = new Promise(resolve=>{
            resolve(scripts);
        });

        Scenario = {
            findAsync: sinon.stub().returns(promise)
        };

        mongoose = {
            connection: {
                on: (event, cb)=>cb()
            }
        };

        proxyquire('./loader', {
            'mongoose': mongoose ,
            './scenario.manager': scenarioManager,
            './scenario.model': Scenario
        });
    });

    it('will load all scripts', function(done){
        promise.then(()=>{
            expect(scenarioManager.start).to.have.been.calledWith('a');
            expect(scenarioManager.start).to.have.been.calledWith('b');
            expect(scenarioManager.start).to.have.been.calledWith('c');
            done();
        });
    });

});
