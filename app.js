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
const AppDataSource = require("./utils/database.js");
const admin = require("firebase-admin");
const { default: rateLimit } = require("express-rate-limit");
const timeout = require("connect-timeout");
const StatusCode = require("./enum/status-code.js");
const Status = require("./enum/status");
const ErrorCode = require("./enum/error-code.js");
const { configureCloudinary } = require("./utils/cloudinary.js");
const { google } = require("googleapis");
const { default: base64url } = require("base64url");

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

let refreshToken = process.env.REFRESH_TOKEN;

function createEmail(to, subject, message) {
  const str = [
    `Content-Type: text/plain; charset="UTF-8"`,
    "MIME-Version: 1.0",
    `To: ${to}`,
    `From: ${process.env.EMAIL_USER}`,
    `Subject: ${subject}`,
    "",
    message,
  ].join("\n");

  const encodedEmail = base64url(Buffer.from(str, "utf-8"));
  return encodedEmail;
}

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

    app.get("/google-auth", (req, res) => {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.send"],
        prompt: "consent",
      });
      console.log("Authorize this app by visiting this URL:", authUrl);
      res.redirect(authUrl);
    });

    app.get("/oauth2callback", async (req, res) => {
      const code = req.query.code;
      if (!code) return res.status(400).send("Authorization code not found!");

      try {
        const { tokens } = await oAuth2Client.getToken(code);
        if (tokens.refresh_token) {
          oAuth2Client.setCredentials(tokens);
          refreshToken = tokens.refresh_token;
          console.log("Refresh Token received:", refreshToken);
          res.send("Authorization successful! Refresh Token saved.");
        } else {
          console.error("No refresh token received!");
          res.status(500).send("No refresh token received from Google.");
        }
      } catch (error) {
        console.error("Error retrieving tokens:", error);
        res.status(500).send("Error retrieving tokens.");
      }
    });

    // Endpoint gửi email
    app.post("/send-email", async (req, res) => {
      try {
        if (!refreshToken) {
          return res
            .status(400)
            .send("Refresh Token not found. Please authorize first.");
        }

        // Cập nhật credentials của oAuth2Client với refresh token
        oAuth2Client.setCredentials({ refresh_token: refreshToken });

        // Tạo email dưới dạng MIME
        const rawEmail = createEmail(
          req.body.to,
          req.body.subject,
          req.body.text
        );

        // Gửi email thông qua Gmail API
        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
        const request = {
          userId: "me", // "me" có nghĩa là tài khoản người dùng hiện tại
          resource: {
            raw: rawEmail,
          },
        };

        const response = await gmail.users.messages.send(request);
        console.log("Email sent:", response.data);
        res.send("Email sent successfully.");
      } catch (error) {
        console.error("Error sending email:", error);
        if (error.message.includes("invalid_grant")) {
          return res
            .status(401)
            .send("Refresh Token has expired. Please re-authorize.");
        }
        res.status(500).send("Failed to send email.");
      }
    });

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
