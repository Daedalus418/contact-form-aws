const AWS = require('aws-sdk');
const SES = new AWS.SES();


function sendEmail(formData, callback) {
  const emailParams = {
    Source : 'viridis.webdev@gmail.com', // SES SENDING EMAIL
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: ['viridis.webdev@gmail.com'], // SES RECEIVING EMAIL
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.reply_to}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New message from your_site.com'
      }
    }
  };

  SES.sendEmail(emailParams, callback);
}

module.exports.staticSiteMailer = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendEmail(formData, function (err, data) {
    const response = {
      statusCode: err
        ? 500
        : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://daedalus418.github.io/React-cv/'
      },
      body: JSON.stringify({
        message: err
          ? err.message
          : data
      })
    };

    callback(null, response);
  });
};
