const { HttpStatusCode } = require("axios");
const jwt = require("jsonwebtoken");

const jwtVerify = (token) =>
  jwt.verify(
    token,
    strapi.config.get("plugin.users-permissions.jwtSecret"),
    (err, result) => {
      if (err) {
        return HttpStatusCode.Unauthorized;
      }
      return result;
    }
  );

module.exports = { jwtVerify };
