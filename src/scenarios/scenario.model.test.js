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
    let scenarioConverter;

    beforeEach(() => {

        // NOTE: deleting
        delete mongoose.models.Scenario;
        delete mongoose.modelSchemas.Scenario;

        scenarioManager = {
            start: sinon.stub(),
            stop: sinon.stub()
        };

        scenarioConverter = {
            convertScenario: sinon.stub().returns(new Promise(resolve=> {
                resolve();
            }))
        };

        sut = proxyquire('./scenario.model', {
            './scenario.manager': scenarioManager,
            './scenario.converter': scenarioConverter
        });
    });

    describe('#Save/Update', () => {
        let instance;

        it('will start active scenario', (done) => {
            instance = new sut({
                active: true,
                name: 'some name',
                body: 'some code here'
            });

            instance.saveAsync()
                .then(() => {
                    expect(scenarioManager.start).to.have.been.calledWith(instance);
                    done();
                })
                .catch(done);
        });

        it('will stop inactive scenario', (done) => {
            instance = new sut({
                active: false,
                name: 'some name',
                body: 'some code here'
            });

            instance.saveAsync()
                .then(() => {
                    expect(scenarioManager.stop).to.have.been.calledWith(instance);
                    done();
                })
                .catch(done);
        });

        it('will convert scenario', (done) => {
            let scenario = {
                active: true,
                name: 'some name',
                wizard: {
                    conditions: [{device: 'light', condition: 'GREATER_THAN', value: 5}],
                    actions: [{device: 'air-conditioner', value: 'ON'}],
                    logicalOperator: ''
                },
                isConvertible: true
            };

            instance = new sut(scenario);

            instance.saveAsync()
                .then(() => {
                    expect(scenarioConverter.convertScenario).to.have.been.calledWith(scenario.wizard);
                    done();
                })
                .catch(done);
        });
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
