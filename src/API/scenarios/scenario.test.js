import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import app from '../../index';
import '../../../test/config/mongo';
import mongoose from 'mongoose';
import ScenarioModel from '../../scenarios/scenario.model';

describe('## scenario APIs', () => {
    let scenarios;

    beforeEach((done)=>{
        let raw_scenarios = [];

        raw_scenarios.push(ScenarioModel({
            _id: mongoose.Types.ObjectId('000000000000000000000000'),
            name: 'Greeting script',
            description: 'will greet you in a brand new world',
            active: true,
            body: 'console.log("Hello Scripto World!");'
        }));

        raw_scenarios.push(ScenarioModel({
            _id: mongoose.Types.ObjectId('000000000000000000000001'),
            name: 'Other script',
            description: 'other description',
            body: 'console.log("Bye");'
        }));

        ScenarioModel.create(...raw_scenarios)
            .then(()=>{
                scenarios = raw_scenarios.map(s=>s.toObject());
                done();
            })
            .catch(done);
    });

    describe('# GET /api/scenarios/:scenarioId', () => {
        it('should get scenario details', (done) => {
            request(app)
                .get(`/api/scenarios/${scenarios[0].id}`)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.deep.equal(scenarios[0]);
                    done();
                })
                .catch(done);
        });
    });

    describe('# GET /api/scenarios/', () => {
        it('should get all scenarios', (done) => {
            request(app)
                .get('/api/scenarios')
                .expect(httpStatus.OK)
                .then(res => {
                    let sort_function = (a,b)=>a.id < b.id;
                    expect(res.body.sort(sort_function)).to.deep.equal(scenarios.sort(sort_function));
                    done();
                })
                .catch(done);
        });
    });

    describe('# PUT /api/scenarios/:id', () => {
        it('should update scenario', (done) => {
            const originalScenario = scenarios[0],
                modifiedScenario = Object.assign({}, originalScenario, {description: 'new description'});
            request(app)
                .put(`/api/scenarios/${originalScenario.id}`)
                .send(modifiedScenario)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.deep.equal(modifiedScenario);
                    done();
                });
        });
    });

    describe('# POST /api/scenarios', () => {
        it('should update scenario', (done) => {
            const scenario = Object.assign({}, scenarios[0]);
            delete scenario.id;

            request(app)
                .post('/api/scenarios')
                .send(scenario)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.contain(scenario);
                    done();
                });
        });
    });

    describe('# DELETE /api/scenarios/:id', () => {
        it('should delete scenario', (done) => {
            request(app)
                .delete(`/api/scenarios/${scenarios[0].id}`)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.deep.equal(scenarios[0]);
                    done();
                })
                .catch(done);
        });
    });
});
