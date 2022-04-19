const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const msg = {
  to: 'pchmn.dev@gmail.com',
  from: {
    email: 'no-reply@voker.app',
    name: 'Voker'
  }, // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>'
};
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error(error);
  });
