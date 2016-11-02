import chai from 'chai';
import sut from './convert-mqtt-message-to-event';
chai.should();

describe('mqtt-clinet/event/convert-mqtt-message-to-event', () => {

    const topic = 'prefix/myDevice';
    let rawMessage,
        result;

    context('when message is string', () => {
        beforeEach(() => {
            rawMessage = 'myDeviceMessage';
            result = sut(topic, rawMessage);
        });

        it('should convert to status event message', () => {
            result.event.should.equal('status');
        });

        it('should extract device name from topic', () => {
            result.device.should.equal('myDevice');
        });

        it('should use raw message for event value', () => {
            result.value.should.equal(rawMessage);
        });
    });

    context('when message is object', () => {
        const message = {
            value: 'value'
        };

        beforeEach(() => {
            rawMessage = JSON.stringify(message);
            result = sut(topic, rawMessage);
        });

        it('should convert to status event message', () => {
            result.event.should.equal('device-info');
        });

        it('should extract device name from topic', () => {
            result.device.should.equal('myDevice');
        });

        it('should use deserialized json message for event value', () => {
            result.value.should.deep.equal(message);
        });
    });

});