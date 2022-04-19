import * as sgMail from '@sendgrid/mail';
import * as crypto from 'crypto';
import { Response } from 'express';
import { https, logger, runWith } from 'firebase-functions';
import * as fs from 'fs';
import * as path from 'path';

const MAIN_BACKGROUND_COLOR = {
  dark: '#141517',
  light: '#fff'
};
const CONTENT_BACKGROUND_COLOR = {
  dark: '#1A1C1E',
  light: '#F8F9FA'
};
const TEXT_COLOR = {
  dark: '#C1C2C5',
  light: '#000'
};
const LOGO_URL = {
  dark: 'https://ik.imagekit.io/voker/logo-voker-dark_DNoKAw2bh.png',
  light: 'https://ik.imagekit.io/voker/logo-voker-light_lK-OILpBO.png'
};

function checkRequestValidity(request: https.Request, response: Response, context: unknown): boolean {
  // Check POST method
  if (request.method !== 'POST') {
    logger.error(`endpoint called with method ${request.method}`, context);
    response.status(400).send({ code: 40, message: 'this endpoint only supports POST requests' });
    return false;
  }
  const email = request.body.email;
  // Check email param
  if (!email) {
    const error = 'email is required';
    logger.error(error, context);
    response.status(400).send({ code: 41, message: error });
    return false;
  }
  // Check email validity
  const regex = new RegExp(/^\S+@\S+$/);
  if (!regex.test(email)) {
    const error = `${email} is not a valid email address`;
    logger.error(error, context);
    response.status(400).send({ code: 42, message: error });
    return false;
  }
  // Check Sendgrid API key
  if (!process.env.SENDGRID_API_KEY) {
    logger.error('SENDGRID_API_KEY is not set', context);
    response.status(500).send({ code: 50, message: 'unknown error' });
    return false;
  }
  return true;
}

function generateMessageEmail(email: string, colorScheme: 'light' | 'dark' = 'light'): sgMail.MailDataRequired {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const htmlEmailTemplate = fs
    .readFileSync(path.join(__dirname, `./emailTemplates/emailTemplate.html`), 'utf8')
    .replaceAll('{{LOGO_URL}}', LOGO_URL[colorScheme])
    .replaceAll('{{MAIN_BACKGROUND_COLOR}}', MAIN_BACKGROUND_COLOR[colorScheme])
    .replaceAll('{{CONTENT_BACKGROUND_COLOR}}', CONTENT_BACKGROUND_COLOR[colorScheme])
    .replaceAll('{{TEXT_COLOR}}', TEXT_COLOR[colorScheme]);

  return {
    to: email,
    from: {
      email: 'no-reply@voker.app',
      name: 'Voker'
    },
    subject: 'Sign in to Voker',
    html: htmlEmailTemplate
  };
}

export const sendSignInLink = runWith({ secrets: ['SENDGRID_API_KEY'] }).https.onRequest(async (request, response) => {
  const context = {
    context: { requestId: crypto.randomBytes(3 * 4).toString('base64'), method: request.method, body: request.body }
  };
  logger.info('sendSignInLink function starts', context);

  if (!checkRequestValidity(request, response, context)) {
    return;
  }

  sgMail
    .send(generateMessageEmail(request.body.email, request.body.colorScheme))
    .then(() => {
      logger.info(`Signin link successfully sent to ${request.body.email}`, context);
      response.send();
    })
    .catch((error) => {
      logger.error(`Error when sending email to ${request.body.email}: ${error.message}`, context);
      response.status(500).send({ code: 51, message: 'error when sending email' });
    });
});
