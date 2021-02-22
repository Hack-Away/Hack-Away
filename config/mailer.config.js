const nodemailer = require('nodemailer');
const appUrl = process.env.APP_URL;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASSWORD;
const Order = require('../models/order.model')

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

module.exports.sendConfirmationOrder = (email, name, userTarget) => {

  Order.findById(userTarget.order)
      .populate('createdBy')
      .populate('productList.product')
      .then(order => {
          transport.sendMail({
            from: email,
            to: user,
            subject: `${userTarget.name}, your order has been sended!`,
            html: 
                `
                <h1>Hi ${userTarget.name}</h1>
                <h2 style="margin: 0 auto">Your order has been send to restaurant</h2>
                <p>You can view the state of your Order in the next link: <a href="${appUrl}/order/confirm/${order.id}" style="padding: 10px 20px; color: white; background-color: pink; border-radius: 5px; text-decoration-none">Check your Order here!</a></p>
                <p>Order Ref: ${order.id}</p>
                <p>Order Created At: ${order.createdAt}</p>
                <p><strong>You left the following message to Restaurant:</strong></p>
                <p>- ${order.message}</p>
                `
            })
            .then(() => console.log(`---MAILER--- manda mail a ${name}`))
            .catch(error => console.log(error))
      })
      .catch(error => console.log(error))

}