const genericServerError = {
  summary: "Internal server error. Please try again"
};
module.exports.validationException = {
  status: 400,
  code: 'VALIDATION_ERRORS',
  message: 'Request has validation errors',
  stack: {
    sampleField: {
      summary: 'Summary message for sample field',
      inline: 'Inline message for sample field'
    }
  }
};
module.exports.serviceException = {
  statusCode: 405,
  message: 'Service error message',
  stack: genericServerError
};
module.exports.genericServerException = {
  status: 500,
  message: 'Generic server error message',
  stack: genericServerError
};
module.exports.exceptionWithNoStatus = {
  message: 'Error message with no status',
  stack: genericServerError
};