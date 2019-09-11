function memoize(fn) {
    let result;

    return function() {
        if (result) {
            return result;
        }
        result = fn(arguments);
        return result;
    };
}

module.exports = memoize;
