const nodemailer = require("nodemailer");

const SendVerificationEmail = async(Email,VerifyLink) =>{
  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.EMAIL,
      pass:process.env.NODEMAILER_PASS,
    }
  });

  const mailOptions = {
    from:process.env.Email,
    to:Email,
    subject:"WILDLIFE TRACKER- Email Verification",
    html:`<h2> Hello for WILDLIFE TRACKER.</h2>
    <p>Click the link below to verify the Email</p>
    <a href="${VerifyLink}">Verify Email</a>
    <p>This link will expire in 15 min</p>
    <p>If you did not request this, please ignore this email</p>`,
  }
  await transporter.sendMail(mailOptions);
  
};
module.exports = SendVerificationEmail; 