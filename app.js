const express = require("express");
const cors = require("cors");
const Setup = require("./setup.js");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user-routes.js");
const authenticationRoutes = require("./routes/authentication-routes.js");
const otpRoutes = require("./routes/otp-routes.js");
const patientRoutes = require("./routes/patient-routes.js");
const medicineRoutes = require("./routes/medicine-routes.js");
const examRoomRoutes = require("./routes/examRoom-routes.js");
const recordRoutes = require("./routes/record-routes.js");
const orderRoutes = require("./routes/order-routes.js");
const notificationRoutes = require("./routes/notification-routes.js");
const doctorRoutes = require("./routes/doctor-routes.js");
const AppDataSource = require("./utils/database.js");
const admin = require("firebase-admin");
const { default: rateLimit } = require("express-rate-limit");
const timeout = require("connect-timeout");
const StatusCode = require("./enum/status-code.js");
const Status = require("./enum/status");
const ErrorCode = require("./enum/error-code.js");
const { configureCloudinary } = require("./utils/cloudinary.js");

dotenv.config();

try {
  configureCloudinary();
} catch (error) {
  console.error("Application startup failed:", error.message);
  process.exit(1);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: "Too many request from this IP, please try again later",
});

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.API_KEY)),
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected and synchronized!");
    const setup = new Setup();
    setup.setupDatabase();
  })
  .then(() => {
    console.log("Database setup complete");

    const app = express();
    app.use(cors());
    app.use(timeout("10s"));
    const PORT = process.env.PORT || 3000;

    app.use((req, res, next) => {
      if (!req.timedout) next();
    });

    app.use(express.json());
    app.use(limiter);
    app.use("/users", userRoutes);
    app.use("/auth", authenticationRoutes);
    app.use("/otp", otpRoutes);
    app.use("/patient", patientRoutes);
    app.use("/medicine", medicineRoutes);
    app.use("/examroom", examRoomRoutes);
    app.use("/record", recordRoutes);
    app.use("/order", orderRoutes);
    app.use("/notification", notificationRoutes);
    app.use("/doctor", doctorRoutes);

    app.use((err, req, res, next) => {
      if (err.timeout) {
        res.status(StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: ErrorCode.TIMEOUT_REQUEST,
        });
      } else {
        next(err);
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
      console.log(
        "Server started at",
        new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      );
    });
  })
  .catch((err) => {
    console.error("Database connection or setup error:", err);
  });

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
