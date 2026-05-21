class ApiResponse {
  static ok(res, message = "Success", data) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, message = "created", data) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }
  static noContent(res, message, data) {
    return res.status(204).json({
      success: true,
      message,
      data,
    });
  }
}

export default ApiResponse;
