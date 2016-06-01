import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import '../test/mongo';
import mongoose from 'mongoose';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Scenario Model', () => {
    let sut;
    let scenarioManager;

    beforeEach(function () {

        // NOTE: deleting
        delete mongoose.models.Scenario;
        delete mongoose.modelSchemas.Scenario;

        scenarioManager = {
            start: sinon.spy(),
            stop: sinon.spy()
        };

        sut = proxyquire('./scenario.model', {
            './scenario.manager': scenarioManager
        });
    });

    it('will execute script', function (done) {
        const script = {
            name: 'test-name',
            body: 'console.log("test-body")'
        };

        const instance = new sut(script);

        instance.saveAsync()
            .then(()=> {
                expect(scenarioManager.start).to.have.been.calledWithMatch({
                    id: sinon.match.string,
                    active: sinon.match.bool,
                    name: script.name,
                    body: script.body
                });
                done();
            })
            .catch(done);

    });

    describe('#Remove', () => {
        it('should stop running scenario', (done) => {
            let instance;

            instance = new sut({name: 'some name'});
            instance.saveAsync()
                .then((doc) => doc.removeAsync())
                .then(() => {
                    expect(scenarioManager.stop).to.have.been.calledWith(instance);
                    done();
                })
                .catch(done);
        });
    });
});
