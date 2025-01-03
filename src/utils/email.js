const nodemailer = require("nodemailer");
const { SMTP_USER, SMTP_PASS } = require("../accessEnv");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
});


/**
 * Send email using nodemailer
*/
const sendEmailByNodeMailer = async (data) =>  {

    try {
        const mailData = {
            from: SMTP_USER, // sender address
            to: data.emails, // list of receivers
            subject: data.subject, // Subject line
            text: data.text, // plain text body
            html: data.html, // html body
          }
        const info = await transporter.sendMail(mailData);
        
        
        console.log("Message sent ID: %s", info.messageId);
        console.log("Message sent ReS: %s", info.response);
    } catch (error) {
        console.error(error);
        throw error
    }
  
}

module.exports = sendEmailByNodeMailer