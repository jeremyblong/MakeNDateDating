const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "support@makendate.com", // generated ethereal user
      pass: "", // generated ethereal password
    },
});

module.exports = transporter
