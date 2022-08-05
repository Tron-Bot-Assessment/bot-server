const HttpStatus = require('http-status-codes');

// export interface IError {
//   status?: number;
//   code?: number;
//   message?: string;
// }
/**
 * NOT_FOUND(404) middleware to catch error response
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 */
function notFoundErrorHandler(req, res, next) {
  res.status(HttpStatus.StatusCodes.NOT_FOUND).json({
    success: false,
    error: {
      code: HttpStatus.StatusCodes.NOT_FOUND,
      message: HttpStatus.getStatusText(HttpStatus.StatusCodes.NOT_FOUND),
    },
  });
}

/**
 * Generic error response middleware
 *
 * @param  {object}   err
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 */
function errorHandler(err, req, res, next) {
  res.status(err.status || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: err.code || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
      message: err.message || HttpStatus.getStatusText(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
    },
  });
}

module.exports = {
  notFoundErrorHandler,
  errorHandler
};
