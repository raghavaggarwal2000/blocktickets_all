
const multerErrorHandler = (err, req, res, next) => {
    if (err) {
      res.status(413).json({err: err.message })
      // res.send(413)
      
    } else {
      next()
    }
}

module.exports = multerErrorHandler;