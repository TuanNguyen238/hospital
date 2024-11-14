const cloudinary = require("cloudinary").v2;

// Cờ để kiểm tra Cloudinary đã được cấu hình hay chưa
let isConfigured = false;

function configureCloudinary() {
  if (!isConfigured) {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      isConfigured = true;
      console.log("Cloudinary configured successfully!");
    } catch (error) {
      console.error("Error configuring Cloudinary:", error.message);
    }
  }
}

module.exports = { cloudinary, configureCloudinary };
