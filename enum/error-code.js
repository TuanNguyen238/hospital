const ErrorCode = {
  USER_NOT_EXISTED: "Người dùng không tồn tại",
  USER_ALREADY_EXISTS: "Người dùng đã tồn tại",
  ROLE_NOT_EXISTED: "Vai trò không tồn tại",
  UNAUTHENTICATED: "Đăng nhập không thành công",
  PHONE_NUMBER_NOT_EXISTED: "Số điện thoại chưa đăng ký tài khoản",
  INVALID_OTP: "Mã OTP không hợp lệ",
  OTP_SENT: "Mã OTP đã được gửi đi",
  OTP_ERROR: "Lỗi xảy ra khi gửi mã OTP",
  OTP_VERIFIED: "Xác thực mã OTP thành công",
  PASS_UPDATED: "Đổi mật khẩu thành công",
  REGISTED: "Đăng ký thành công",
  AUTHENTICATED: "Đăng nhập thành công",
};

module.exports = ErrorCode;
