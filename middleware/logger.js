
function log(req, res, next) {
    console.log('Loading a route...(middleware logger)');
    next();
}

module.exports = log;