/**
 * 自定义400错误类
 */

class BadRequest extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    }
}

/**
 * 自定义401错误类
 */
class Unauthorized extends Error {
    constructor(message) {
        super(message);
        this.name = 'Unauthorized';
    }
}

/**
 * 自定义404错误类
 */
class NotFound extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFound';
    }
}

module.exports = {
    BadRequest,
    Unauthorized,
    NotFound
}