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
                {device: 'any', condition: 'LESS_THAN_OR_EQUAL_TO', value: '123'}
            ],
            actions: [],
            logicalOperator: ''
        };

        convertedScenario = sut.convertScenario(scenario);

        expect(convertedScenario).to.include('api.device.get(\'any\').value <= 123');
        done();
    });
});
