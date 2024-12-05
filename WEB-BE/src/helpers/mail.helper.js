const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const oauth2Client = new google.auth.OAuth2(
    global.config.get('MAIL_CLIENT_ID'),
    global.config.get('MAIL_CLIENT_SECRET'),
    global.config.get('MAIL_CALLBACK_URL'),
)

oauth2Client.setCredentials({ refresh_token: global.config.get('MAIL_REFRESH_TOKEN') });


const sendMail = async (email, subject, message) => {
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'baohc110902@gmail.com',
            clientId: global.config.get('MAIL_CLIENT_ID'),
            clientSecret: global.config.get('MAIL_CLIENT_SECRET'),
            refreshToken: global.config.get('MAIL_REFRESH_TOKEN'),
            accessToken: accessToken
        }
    });

    const info = await transporter.sendMail({
        from: '"OSCOURE 🩷" <oscourse@course.email>', // sender address
        to: `${email}`, // list of receivers
        subject: `${subject}`, // Subject line
        text: `${message}`, // plain text body
        html: `<b>${message}</b>`, // html body
    });
    return info;
}



module.exports = {
    sendMail
};