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
  ORDER_CREATED: "Tạo đơn hàng thành công",
  MEDICINE_NOT_EXISTED: "Thuốc không tồn tại",
  MEDICINE_UPDATED: "Cập nhật thuốc thành công",
  EXAMROOM_CREATED: "Tạo phòng khám thành công",
  EXAMROOM_EXISTED: "Phòng khám đã tồn tại",
  EXAMROOM_NOT_AVAILABLE: "Phòng khám đã đầy",
  RECORD_BOOKED: "Đặt phòng khám thành công",
  SUCCESS: "Thành công",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  INSUFFICIENT_PERMISSION: "Lỗi quyền truy cập",
  PATIENT_NOT_EXISTED: "Bệnh nhân không tồn tại",
  LOGOUTED: "Đăng xuất thành công",
  INVALID_REQUEST: "Yêu cầu không hợp lệ",
  TIMEOUT_REQUEST: "Kết nối thất bại, vui lòng kiểm tra lại đường truyền mạng",
  USER_DISABLED: "Tài khoản đã bị vô hiệu hóa",
  MEDICINE_DISABLED: "Sản phẩm đã bị vô hiệu hóa",
  MEDICINE_IMPORTED: "Import thuốc thành công",
  STATUS_UPDATED: "Cập nhật trạng thái thành công",
  INSUFFICIENT_STOCK: "Số lượng sản phẩm trong kho không đủ",
  RESET_ORDER_MEDICINE: "Reset Order-Medicine thành công",
  REWARDPOINT_NOT_ENOUGH: "Điểm tích lũy không đủ",
  IMAGE_EXITED: "Ảnh đã tồn tại",
  MEDICINE_NAME_EXISTED: "Tên thuốc đã tồn tại",
};
// const ErrorCode = {
//   USER_NOT_EXISTED: "User does not exist",
//   USER_ALREADY_EXISTS: "User already exists",
//   ROLE_NOT_EXISTED: "Role does not exist",
//   UNAUTHENTICATED: "Incorrect password",
//   PHONE_NUMBER_NOT_EXISTED: "Phone number not registered",
//   INVALID_OTP: "Invalid OTP code",
//   OTP_SENT: "OTP code has been sent",
//   OTP_VERIFIED: "OTP verification successful",
//   PASS_UPDATED: "Password updated successfully",
//   REGISTED: "Registration successful",
//   AUTHENTICATED: "Login successful",
//   UPDATE_INFO: "Account information updated successfully",
//   TOKEN_UNAUTHENTICATED: "Invalid authentication session",
//   TOKEN_EXPIRED: "Authentication session expired",
//   PATIENT_CREATED: "Patient created successfully",
//   PRIVACY: "User privacy violation",
//   MEDICINE_CREATED: "Medicine created successfully",
//   ORDER_CREATED: "Order created successfully",
//   MEDICINE_NOT_EXISTED: "Medicine does not exist",
//   MEDICINE_UPDATED: "Medicine updated successfully",
//   EXAMROOM_CREATED: "Exam room created successfully",
//   EXAMROOM_EXISTED: "Exam room already exists",
//   EXAMROOM_NOT_AVAILABLE: "Exam room is full",
//   RECORD_BOOKED: "Exam room booked successfully",
//   SUCCESS: "Success",
//   INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
//   INSUFFICIENT_PERMISSION: "Insufficient access permissions",
//   PATIENT_NOT_EXISTED: "Patient does not exist",
//   LOGOUTED: "Logged out successfully",
//   INVALID_REQUEST: "Invalid request",
//   TIMEOUT_REQUEST: "Connection failed, please check your network",
//   USER_DISABLED: "Account has been disabled",
//   MEDICINE_DISABLED: "Product has been disabled",
//   STATUS_UPDATED: "Status updated successfully",
//   INSUFFICIENT_STOCK: "Insufficient stock quantity",
// };

module.exports = ErrorCode;
