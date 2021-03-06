const nodemailer = require('nodemailer');

module.exports = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Kakao',
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      // secure: true,
      // requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const mailContent = {
      from: process.env.MAIL_USER,
      to: email,
      subject: '쇼핑몰 이메일 뉴스레터 신청',
      html: `
        <h1>뉴스레터 신청입니다.</h1>
        <h2>${email}</h2>`,
    };
    const rs = await transporter.sendMail(mailContent);
    return rs;
  } catch (err) {
    return err;
  }
};
