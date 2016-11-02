describe('# Scenario converter', () => {
    let sut;
    let scenario;

    const NO_SCENARIO_ERROR_MESSAGE = 'No scenario JSON received!';
    const INCORRECT_SCENARIO_ERROR_MESSAGE = 'Incorrect scenario JSON received!';
    const NO_LOGICAL_OPERATOR_ERROR_MESSAGE = 'Missing logical operator!';

    beforeEach(function () {
        sut = require('./scenario.converter');
    });

    it('will return error message if scenario object is not passed', function (done) {
        sut
            .convertScenario()
            .catch((errorMessage) => {
                expect(errorMessage).to.equal(NO_SCENARIO_ERROR_MESSAGE);
                done();
            });
    });

    it('will return error message if there are no actions', function (done) {
        scenario = {
            actions: []
        };

        sut
            .convertScenario(scenario)
            .catch((errorMessage) => {
                expect(errorMessage).to.equal(INCORRECT_SCENARIO_ERROR_MESSAGE);
                done();
            });
    });

    it('will return error message if there are more than two conditions and logical operator is missing', function (done) {
        scenario = {
            conditions: [
                {device: 'any', condition: 'LESS_THAN_OR_EQUAL_TO', value: '123'},
                {device: 'any other', condition: 'EQUAL_TO', value: '321'}
            ],
            actions: [{device: 'any', value: 'ON'}],
            logicalOperator: ''
        };

        sut
            .convertScenario(scenario)
            .catch((errorMessage) => {
                expect(errorMessage).to.equal(NO_LOGICAL_OPERATOR_ERROR_MESSAGE);
                done();
            });
    });

    it('will replace all conditions in string', function (done) {
        scenario = {
            conditions: [
                {device: 'any', condition: 'LESS_THAN_OR_EQUAL_TO', value: '123'},
                {device: 'any other', condition: 'EQUAL_TO', value: '321'}
            ],
            actions: [{device: 'any', value: 'ON'}],
            logicalOperator: 'OR'
        };

        sut
            .convertScenario(scenario)
            .then((jsBody) => {
                expect(jsBody).to.include('api.device.get(\'any\').value <= 123');
                expect(jsBody).to.include('api.device.get(\'any other\').value === 321');
                done();
            });
    });

    it('will replace all actions in string', function (done) {
        scenario = {
            actions: [
                {device: 'any', value: 'ON'},
                {device: 'any other', value: 'OFF'}
            ]
        };

        sut
            .convertScenario(scenario)
            .then((jsBody) => {
                expect(jsBody).to.include('api.device.get(\'any\').send(\'ON\')');
                expect(jsBody).to.include('api.device.get(\'any other\').send(\'OFF\')');
                done();
            });
    });

    it('will paste logical operator in string', function (done) {
        scenario = {
            conditions: [
                {device: '1', condition: 'LESS_THAN_OR_EQUAL_TO', value: '1'},
                {device: '2', condition: 'EQUAL_TO', value: '2'}
            ],
            actions: [{device: 'any', value: 'ON'}],
            logicalOperator: 'OR'
        };

        sut
            .convertScenario(scenario)
            .then((jsBody) => {
                expect(jsBody).to.include('||');
                done();
            });
    });

    it('will add all condition devices in string', function (done) {
        scenario = {
            conditions: [
                {device: '1', condition: 'LESS_THAN_OR_EQUAL_TO', value: '1'},
                {device: '2', condition: 'EQUAL_TO', value: '2'}
            ],
            actions: [{device: 'any', value: 'ON'}],
            logicalOperator: 'OR'
        };

        sut
            .convertScenario(scenario)
            .then((jsBody) => {
                expect(jsBody).to.include('[\'1\', \'2\']');
                done();
            });
    });
});
