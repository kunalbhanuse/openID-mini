class ApiError extends Error {
  constructor(statusCode, message = "something went wrong") {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
  }
  static badRequest(message = "bad request") {
    return new ApiError(400, message);
  }
  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }
  static forbidden(message = "forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "not found") {
    return new ApiError(404, message);
  }
}

export default ApiError;
