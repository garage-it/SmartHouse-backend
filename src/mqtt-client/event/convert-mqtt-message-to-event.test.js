import sut from './convert-mqtt-message-to-event';
import { DEVICE_STATUS } from './event-type';

describe('mqtt-clinet/event/convert-mqtt-message-to-event', () => {

    const topic = 'prefix/myDevice';
    let rawMessage,
        result;

    context('when message is string', () => {
        beforeEach(() => {
            rawMessage = 'ON_OFF';
            result = sut(topic, new Buffer(rawMessage));
        });

        it('should send event type ', () => {
            result.event.should.equal(DEVICE_STATUS);
        });

        it('should extract device name from topic', () => {
            result.device.should.equal('myDevice');
        });

        it('should convert buffer raw message to string', () => {
            result.value.should.equal(rawMessage);
        });
    });

});