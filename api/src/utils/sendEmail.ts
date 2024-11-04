import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
};

export const notifyReserve = async (to: string, bookTitle: string, user: string) => {
  const subject = `Reserva confirmada: ${bookTitle}`;
  const text = `Olá ${user},\n\nSua reserva para o livro "${bookTitle}" foi confirmada.\n\nVocê tem 1 dia para retirar o livro.\n\nObrigado!`;

  await sendEmail(to, subject, text);
};

export const notifyUserAvailableForPickup = async (to: string, bookTitle: string, user: string) => {
  const subject = `Livro Disponível: ${bookTitle}`;
  const text = `Olá ${user},\n\nSeu livro "${bookTitle}" Está disponível para retirada.\n\nVocê tem 2 dias para retirar.\n\nObrigado!`;

  await sendEmail(to, subject, text);
};
