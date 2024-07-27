const express = require("express");
const Setup = require("./setup.js");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user-routes.js");
const authenticationRoutes = require("./routes/authentication-routes.js");
const AppDataSource = require("./utils/configs.js");
const admin = require("firebase-admin");

dotenv.config();

const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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
    const PORT = process.env.PORT || 3000;

    app.use(express.json());
    app.use("/users", userRoutes);
    app.use("/auth", authenticationRoutes);

    app.post("/request-otp", async (req, res) => {
      const { phoneNumber, fcmToken } = req.body;

      const message = {
        token: fcmToken,
        data: {
          phone_number: phoneNumber,
          otp_request: "true",
        },
      };

      try {
        await admin.messaging().send(message);
        res.send("OTP request sent to Flutter app");
      } catch (error) {
        console.error("Error sending FCM message:", error);
        res.status(500).send("Error sending OTP request");
      }
    });

    app.post("/verify-otp", (req, res) => {
      const { phone_number, otp } = req.body;
      console.log(phone_number, otp);
      /*const otpStore = {
        84937837564: "123456",
      };

      if (otpStore[phone_number] && otpStore[phone_number] === otp) {
        res.status(200).send("OTP verified successfully");
      } else {
        res.status(400).send("Invalid OTP");
      }*/
    });

    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection or setup error:", err);
  });
