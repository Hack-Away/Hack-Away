const nodemailer = require('nodemailer');
 
const appUrl = process.env.APP_URL;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASSWORD;

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user,
    pass,
  },
});

module.exports.sendValidationEmail = (email, activationToken, name) => {
 
  transport
    .sendMail({
      to: email,
      from: `Hack-Away team <${user}>`,
      subject: 'Activate your account',
      html: `
					<h1>Hi ${name}</h1>
					<p>Click on the button below to activate your account </p>
					<a href="${appUrl}/activate?token=${activationToken}" style="padding: 10px 20px; color: white; background-color: pink; border-radius: 5px;">Click here</a>
				`,
    })
    .then(() => {
      console.log('email sent');
    })
    .catch(console.error);
};

/* 
mi error en consola 
code: 'EAUTH',
  response: '535-5.7.8 Username and Password not accepted. Learn more at\n' +
    '535 5.7.8  https://support.google.com/mail/?p=BadCredentials b7sm5940163wrs.50 - gsmtp',
  responseCode: 535,
  command: 'AUTH PLAIN'
}

*/