const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "66c46490c350dd",
    pass: "8b7fe54d8111b8"
  }
});

module.exports = transport;