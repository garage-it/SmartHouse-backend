import proxyquire from 'proxyquire';
import Promise from 'bluebird';

xdescribe('# Scenario loader', () => {
    let Scenario;
    let mongoose;
    let scenarioManager;
    let promise;

    let scripts;

    beforeEach(function () {
        scripts = [{
            body: 'a',
            active: true
        }, {
            body: 'b',
            active: false
        }, {
            body: 'c',
            active: true
        }];

        scenarioManager = {
            start: env.spy()
        };

        promise = new Promise(resolve=> {
            resolve(scripts);
        });

        Scenario = {
            findAsync: env.stub().returns(promise)
        };

        mongoose = {
            connection: {
                on: (event, cb)=>cb()
            }
        };

        proxyquire('./loader', {
            'mongoose': mongoose,
            './scenario.manager': scenarioManager,
            './scenario.model': Scenario
        });
    });

    it('will load all scripts', function (done) {
        promise.then(()=> {
            expect(scenarioManager.start).to.have.been.calledWith(scripts[0]);
            expect(scenarioManager.start).not.to.have.been.calledWith(scripts[1]);
            expect(scenarioManager.start).to.have.been.calledWith(scripts[2]);
            done();
        });
    });
});
