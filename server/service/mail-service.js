const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    };

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Activation account on ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Please proceed to the link below to complete the activation.</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        });
    };
}

module.exports = new MailService();