const { default: base64url } = require("base64url");
const dotenv = require("dotenv");
const { google } = require("googleapis");
dotenv.config();

class Email {
  #clientId;
  #clientSecret;
  #redirectUri;
  #oAuth2Client;
  #emailUser;
  #emailScope;
  #refreshToken;

  constructor() {
    this.#clientId = process.env.CLIENT_ID;
    this.#clientSecret = process.env.CLIENT_SECRET;
    this.#redirectUri = process.env.REDIRECT_URI;
    this.#oAuth2Client = new google.auth.OAuth2(
      this.#clientId,
      this.#clientSecret,
      this.#redirectUri
    );
    this.#emailUser = process.env.EMAIL_USER;
    this.#emailScope = process.env.EMAIL_SCOPE;
    this.#refreshToken = process.env.REFRESH_TOKEN;
  }

  async generateUrl() {
    const authUrl = await this.#oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [this.#emailScope],
      prompt: "consent",
    });
    return authUrl;
  }

  async callBack(code) {
    try {
      const { tokens } = await this.#oAuth2Client.getToken(code);
      if (tokens.refresh_token) this.#oAuth2Client.setCredentials(tokens);
      return tokens.refresh_token;
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(obj) {
    try {
      this.#oAuth2Client.setCredentials({ refresh_token: this.#refreshToken });

      const rawEmail = this.#createEmail(obj.to, obj.subject, obj.text);

      const gmail = google.gmail({ version: "v1", auth: this.#oAuth2Client });
      const request = {
        userId: "me",
        resource: {
          raw: rawEmail,
        },
      };

      const response = await gmail.users.messages.send(request);
      return response;
    } catch (error) {
      if (error.message.includes("invalid_grant"))
        console.error("Refresh Token has expired. Please re-authorize.");
      throw error;
    }
  }

  #createEmail(to, subject, message) {
    const str = [
      `Content-Type: text/plain; charset="UTF-8"`,
      "MIME-Version: 1.0",
      `To: ${to}`,
      `From: ${this.#emailUser}`,
      `Subject: ${subject}`,
      "",
      message,
    ].join("\n");

    const encodedEmail = base64url(Buffer.from(str, "utf-8"));
    return encodedEmail;
  }
}

module.exports = Email;
