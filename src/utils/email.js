const nodemailer = require("nodemailer");
const { getAppServiceForServer } = require("./helpers");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: getAppServiceForServer?.email?.smtpEmail,
        pass: getAppServiceForServer?.email?.smtpPassword,
    },
});


/**
 * Send email using nodemailer
*/
const sendEmailByNodeMailer = async (data) =>  {

    try {
        const mailData = {
            from: getAppServiceForServer?.email?.smtpEmail,
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