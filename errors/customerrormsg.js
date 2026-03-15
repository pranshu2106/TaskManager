class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createCustomError = (msg, sc) => {
  return new CustomAPIError(msg, sc);
};

module.exports = {createCustomError,CustomAPIError} ; 