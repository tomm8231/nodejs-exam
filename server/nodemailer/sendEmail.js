import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendMail(recipient, subject, message) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: recipient,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

