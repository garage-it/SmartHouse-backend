const COMPARISON_OPERATORS = {
    'GREATER_THAN': '>',
    'GREATER_THAN_OR_EQUAL_TO': '>=',
    'LESS_THAN': '<',
    'LESS_THAN_OR_EQUAL_TO': '<=',
    'EQUAL_TO': '===',
    'NOT_EQUAL': '!=='
};

const LOGICAL_OPERATORS = {
    'AND': '&&',
    'OR': '||'
};

function getConvertedScenario(req, res) {
    // const SCENARION_JSON = {
    //     conditions: [{
    //         device: 'light',
    //         condition: 'GREATER_THAN',
    //         value: '5'
    //     }, {
    //         device: 'temperature',
    //         condition: 'LESS_THAN',
    //         value: '19'
    //     }],
    //     actions: [{
    //         device: 'air-conditioner',
    //         value: 'ON'
    //     }, {
    //         device: 'light',
    //         value: 'OFF'
    //     }],
    //     logicalOperator: 'OR'
    // }

    const scenarioConfig = JSON.parse(req.query.scenarioConfig);

    res.json(generateScenario(scenarioConfig));
}

function getConditions(conditions, logicalOperator) {
    return conditions
        .reduce((conditionsList, condition) => {
            return [
                ...conditionsList,
                `api.device.get('${ condition.device }').value ${ COMPARISON_OPERATORS[condition.condition] } ${ condition.value }`
            ];
        }, [])
        .join('\n' + LOGICAL_OPERATORS[logicalOperator] + ' ');
}

function getActions(actions) {
    return actions.reduce((actionsString, action) => {
        return actionsString + `api.device.get('${ action.device }').send('${ action.value }');\n`;
    }, '');
}

function generateScenario(scenarioJSON) {
    return (
        `if (
            ${ getConditions(scenarioJSON.conditions, scenarioJSON.logicalOperator) }
        ) {
            ${ getActions(scenarioJSON.actions) }
        }`
    );
}

export default {getConvertedScenario};
