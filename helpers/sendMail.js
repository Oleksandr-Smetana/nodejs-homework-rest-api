const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY, SENDER_MAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async data => {
  try {
    const msg = { ...data, from: SENDER_MAIL };
    await sgMail.send(msg);
    return true;
  } catch (error) {
    throw error.message;
  }
};

// "data" is an object with 3 fields: "to", "subject", "html".
// example:
// data = {
//     to: "example@example.com",
//     subject: "Новая заявка с сайта",
//     html: "<p>Ваша заявка принята</p>"
// }

module.exports = sendMail;
