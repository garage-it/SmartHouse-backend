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

function convertScenario(scenarioJSON) {
    return (
        `if (
            ${ getConditions(scenarioJSON.conditions, scenarioJSON.logicalOperator) }
        ) {
            ${ getActions(scenarioJSON.actions) }
        }`
    );
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

export default {convertScenario};
