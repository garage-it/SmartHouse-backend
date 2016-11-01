import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Commander interface', () => {
    let sut, mockApp = sinon.spy();
    mockApp['@noCallThru'] = true;
    let registredAction = function(){};

    sut = {
        version: sinon.spy(function(){
            return sut;
        }),
        command: sinon.spy(function(){
            return sut;
        }),
        description: sinon.spy(function(){
            return sut;
        }),
        option: sinon.spy(function(){
            return sut;
        }),
        action: sinon.spy(function(fn){
            registredAction = fn;
            return sut;
        }),
        parse: sinon.spy(),
        help:sinon.spy(),
        args: [],
        '@noCallThru': true
    };

    beforeEach(() => {
        proxyquire('./commander', {
            'commander': sut,
            'babel-register': {},
            './app': mockApp
        });
    });

    it('will set program version', () => {
        expect(sut.version).to.have.been.called.once;
    });

    it('will register start command', () => {
        expect(sut.command).to.have.been.calledWith('start [options]');
    });

    it('will register program 33 options', () => {
        expect(sut.option).to.called.callCount(33);
    });

    it('will register action', () => {
        expect(sut.action).to.have.been.called.once;
    });

    it('will call app on action call', () => {
        expect(mockApp).not.to.have.been.called;
        registredAction('', {});
        expect(mockApp).to.have.been.called.once;
    });

    /*
    it('will export result of application run', () => {
        expect(true).to.equal(true);
        //expect(sut).to.equal(mockAppResult);
    });
    */
});
