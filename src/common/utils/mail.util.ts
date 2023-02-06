import Handlebars from 'handlebars';
import mailer from '../config/mail';
import fs from 'fs/promises';
import Mail from 'nodemailer/lib/mailer';
import InternalServerErrorException from '../exceptions/internalServerError.exception';
import logger from '../logger/logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Send an email using nodemailer
 * @param {fs.FileHandle | string | Buffer | URL} htmlPath Path of the html fule
 * @param {any} context object to replace handlebar template
 * @param {Mail.Options} mailOptions mail options
 */
async function sendMail(htmlPath: fs.FileHandle | string | Buffer | URL, context: any, mailOptions: Mail.Options) {
  try {
    const file = await fs.readFile(htmlPath, 'utf-8');
    const template = Handlebars.compile(file);
    const html = template(context);

    const options: Mail.Options = { ...mailOptions, from: process.env.EMAIL, html };

    mailer.sendMail(options, (err) => {
      if (err) throw new InternalServerErrorException();
    });
  } catch (error) {
    logger.error(error);
    throw new InternalServerErrorException();
  }
}

/**
 * Send password reset email request
 * @param {string} to email recipient
 * @param {string} resetURL URL to reset user's password
 */
async function sendRequestResetPasswordMail(to: string, resetURL: string) {
  await sendMail(
    `${__dirname}/../mails/reset_password.html`,
    { url: resetURL },
    {
      to,
      subject: 'Password Reset Request',
    },
  );
}

/**
 * Send verification email request
 * @param {string} to email recipient
 * @param {string} verificationURL URL to verify user's account
 */
async function sendVerificationMail(to: string, verificationURL: string) {
  await sendMail(
    `${__dirname}/../mails/email_verification.html`,
    { url: verificationURL },
    {
      to,
      subject: 'Account Verification',
    },
  );
}

export { sendMail, sendRequestResetPasswordMail, sendVerificationMail };
