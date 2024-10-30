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
const AppDataSource = require("./utils/configs.js");
const admin = require("firebase-admin");
const { default: rateLimit } = require("express-rate-limit");
const timeout = require("connect-timeout");

dotenv.config();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many request from this IP, please try again later",
// });

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
    app.use(timeout("5s"));
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

    app.use((err, req, res, next) => {
      if (err.timeout) {
        res.status(500).json({
          error: "Kết nối thất bại, vui lòng kiểm tra lại đường truyền mạng",
        });
      } else {
        next(err);
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection or setup error:", err);
  });
