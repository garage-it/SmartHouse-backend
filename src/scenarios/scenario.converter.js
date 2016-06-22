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

function convertScenario(scenario) {
    return new Promise(function (resolve, reject) {
        if (!scenario) {
            return reject('No scenario JSON received!');
        }

        if (!scenario.actions || !scenario.actions.length) {
            return reject('Incorrect scenario JSON received!');
        }

        if (scenario.conditions && scenario.conditions.length >= 2 && !scenario.logicalOperator) {
            return reject('Missing logical operator!');
        }

        return resolve(
            `SMART_HOUSE
                .get_api('0.0.1')
                .then(function(api){
                    ${ getScriptBody(scenario) }
                });`
        );
    });

}

function getScriptBody(scenario) {
    if (scenario.conditions && scenario.conditions.length) {
        return (
            `api.on('message', [${ getDeviceList(scenario.conditions) }], function () {
                if (${ getConditions(scenario.conditions, scenario.logicalOperator) }) {
                    ${ getActions(scenario.actions) }
                }
            });`
        );
    } else {
        return getActions(scenario.actions);
    }

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

function getDeviceList(list) {
    return list
        .map(listItem => `\'${ listItem.device }\'`)
        .join(', ');
}

export default {convertScenario};
