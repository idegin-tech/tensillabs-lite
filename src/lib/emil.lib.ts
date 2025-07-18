import * as dotenv from 'dotenv';
dotenv.config();
import { SendMailClient } from "zeptomail";

const url = "api.zeptomail.com/v1.1/email/template";
const token = process.env.SMTP_TOKEN;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
const client: SendMailClient = new SendMailClient({ url, token });

export const sendEmail = async (to: string, subject: string, htmlbody: string) => {
  console.log('\n\nSending email with ZeptoMail to: ', to)
  if(!token) {
    return console.log("SMTP_TOKEN is not set. Email sending is disabled.", {token});
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const response = (await client.sendMail({
      from: {
        address: "noreply@idegin.com",
        name: "noreply",
      },
      to: [
        {
          email_address: {
            address: to,
            name: to,
          },
        },
      ],
      subject,
      htmlbody: `<div>${htmlbody}</div>`,
    })) as unknown;
    return response;
  } catch (error: unknown) {
    console.error('ZeptoMail API error:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unknown error occurred while sending email');
  }
};

export interface CTAMailParams {
  to: string;
  heading: string;
  body: string;
  ctaUrl: string;
  ctaText: string;
  firstName?: string;
  lastName?: string;
}

export const useCTAMail = async ({
  to,
  heading,
  body,
  ctaUrl,
  ctaText,
  firstName,
  lastName
}: CTAMailParams) => {
  console.log(`\n\nSending template email with ZeptoMail to: `, to);
  const templateKey = '2d6f.36c43f1d5a9d8356.k1.da56d530-63f0-11f0-8534-525400d4bb1c.1981e477203';

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const response = await client.sendMailWithTemplate({
      mail_template_key: templateKey,
      from: {
        address: "noreply@idegin.com",
        name: "noreply",
      },
      to: [
        {
          email_address: {
            address: to,
            name: firstName || to,
          },
        },
      ],
      merge_info: {
        "HEADING": heading,
        "BODY": body,
        "CTA_URL": ctaUrl,
        "CTA_TEXT": ctaText,
        "FIRST_NAME": firstName || "",
        "LAST_NAME": lastName || ""
      }
    });
    return response;
  } catch (error: any) {
    console.error('ZeptoMail API error:', error && error.error ? error.error : error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unknown error occurred while sending template email');
  }
};
