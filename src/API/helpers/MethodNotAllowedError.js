import ExtendableError from './ExtendableError';
import httpStatus from 'http-status';

class MethodNotAllowedError extends ExtendableError {
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     */

    constructor(message, status = httpStatus.METHOD_NOT_ALLOWED, isPublic = true) {
        super(message, status, isPublic);
    }
}

export default MethodNotAllowedError;