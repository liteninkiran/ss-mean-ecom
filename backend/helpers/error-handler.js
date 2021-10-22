function errorHandler(err, req, res, next) {
    // TODO... Make more useful error messages
    res.status(500).json({ message: err });
}

module.exports = errorHandler;
