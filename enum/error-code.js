const ErrorCode = {
  USER_NOT_EXISTED: "Người dùng không tồn tại",
  USER_ALREADY_EXISTS: "Người dùng đã tồn tại",
  ROLE_NOT_EXISTED: "Vai trò không tồn tại",
  UNAUTHENTICATED: "Mật khẩu không đúng",
  PHONE_NUMBER_NOT_EXISTED: "Số điện thoại chưa đăng ký tài khoản",
  INVALID_OTP: "Mã OTP không hợp lệ",
  OTP_SENT: "Mã OTP đã được gửi đi",
  OTP_VERIFIED: "Xác thực mã OTP thành công",
  PASS_UPDATED: "Đổi mật khẩu thành công",
  REGISTED: "Đăng ký thành công",
  AUTHENTICATED: "Đăng nhập thành công",
  UPDATE_INFO: "Thay đổi thông tin tài khoản thành công",
  TOKEN_UNAUTHENTICATED: "Phiên xác thực không hợp lệ",
  TOKEN_EXPIRED: "Phiên xác thực hết hạn",
  PATIENT_CREATED: "Tạo bệnh nhân thành công",
  PRIVACY: "Vi phạm quyền riêng tư người dùng",
  MEDICINE_CREATED: "Tạo thuốc thành công",
};

module.exports = ErrorCode;
