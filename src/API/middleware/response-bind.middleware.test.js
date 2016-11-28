import sut from './response-bind.middleware';

describe('responseBindMiddleware', () => {

    let res;
    let resSend;
    let resJson;
    let next;

    beforeEach(() => {

        resSend = env.stub();
        resJson = env.stub();

        res = {
            send: resSend,
            json: resJson
        };

        next = env.stub();

        sut(null, res, next);

    });

    it('should allow using response send without context', () => {
        const { send } = res;
        send();
        resSend.should.calledOn(res);
    });

    it('should allow using response send json without context', () => {
        const { json } = res;
        json();
        resJson.should.calledOn(res);
    });

    it('should process next middleware', () => {
        next.should.called;
    });

});