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
  tls: {
    rejectUnauthorized: false
  }
});

module.exports.sendValidationEmail = (email, activationToken, name) => {
  console.log('--- MAILER--- ejecuta funcion de enviar el mail')
  console.log('--- MAILER --- ', email, activationToken, name)
  console.log('--- MAILER---', user)

  let message = {
    from: email,
    to: user,
    subject: 'test',
    html: '<p>test de prueba</p>'

  }
  transport
    .sendMail(
     {
      to: email,
      from: user,
      subject: 'Activate your account',
      html: 
          `
					<h1>Hi ${name}</h1>
					<p>Click on the button below to activate your account </p>
					<a href="${appUrl}/activate?token=${activationToken}" style="padding: 10px 20px; color: white; background-color: pink; border-radius: 5px;">Click here</a>
          `
    }
      
  )
        .then(() => {
          console.log('--- MAILER--- email de verificacion enviado');
        })
        .catch(error => {
          console.log('--- MAILER--- error con la promesa sendMail --- no manda mail de verificacion')
          console.log(error)
        });

    
};