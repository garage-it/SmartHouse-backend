import chai from 'chai';
import {expect} from 'chai';

chai.config.includeStack = true;

describe('# Scenario converter', () => {
    let sut;
    let scenario;
    let convertedScenario;

    const SCENARIO_EMPTY_JS = `if (
            
        ) {
            
        }`;

    beforeEach(function () {
        sut = require('./scenario.converter');
    });

    it('will return formatted string', function (done) {
        scenario = {
            conditions: [],
            actions: [],
            logicalOperator: ''
        };

        expect(sut.convertScenario(scenario)).to.equal(SCENARIO_EMPTY_JS);
        done();
    });

    it('will replace all conditions in string', function (done) {
        scenario = {
            conditions: [
                {device: 'any', condition: 'LESS_THAN_OR_EQUAL_TO', value: '123'},
                {device: 'any other', condition: 'EQUAL_TO', value: '321'}
            ],
            actions: [],
            logicalOperator: ''
        };

        convertedScenario = sut.convertScenario(scenario);

        expect(convertedScenario).to.include('api.device.get(\'any\').value <= 123');
        expect(convertedScenario).to.include('api.device.get(\'any other\').value === 321');
        done();
    });

    it('will replace all actions in string', function (done) {
        scenario = {
            conditions: [],
            actions: [
                {device: 'any', value: 'ON'},
                {device: 'any other', value: 'OFF'}
            ],
            logicalOperator: ''
        };

        convertedScenario = sut.convertScenario(scenario);

        expect(convertedScenario).to.contain('api.device.get(\'any\').send(\'ON\')');
        expect(convertedScenario).to.include('api.device.get(\'any other\').send(\'OFF\')');
        done();
    });

    it('will paste logical operator in string', function (done) {
        scenario = {
            conditions: [
                {device: '1', condition: 'LESS_THAN_OR_EQUAL_TO', value: '1'},
                {device: '2', condition: 'EQUAL_TO', value: '2'}
            ],
            actions: [],
            logicalOperator: 'OR'
        };

        convertedScenario = sut.convertScenario(scenario);

        expect(convertedScenario).to.include('||');
        done();
    });
});
