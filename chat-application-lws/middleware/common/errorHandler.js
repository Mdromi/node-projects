const createError = require('http-errors')

// 404 not found
const notFoundHandler = (req, res, next) => {
    next(createError(404, 'your requested content not found'))
}

// default errors handler
const errorHandler = (err, req, res, next) => {
    res.locals.error = process.env.NODE_ENV === 'development' ? err: {message: err.message};
    res.status(err.status || 500);
    if (res.locals.html) {
        // html response
        res.render('error', {
            title: "Error Page"
        })
    } else {
        // json response 
        res.json(res.locals.error)
    }

}

module.exports = {
    notFoundHandler,
    errorHandler
}