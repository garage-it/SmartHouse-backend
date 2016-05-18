import scenarioModel from './scenario.model';
import { run } from './runner';


function add(scenario){
    let scenarioDbObject = new scenarioModel(scenario);
    return scenarioModel
        .create(scenarioDbObject)
        .then(function(){
            return run(scenario);
        });
}

export default {
    add
}