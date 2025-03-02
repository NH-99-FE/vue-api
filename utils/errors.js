/**
 * 自定义400错误类
 */

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
    }
}

/**
 * 自定义401错误类
 */
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

/**
 * 自定义404错误类
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
}