export type EmailTemplate = "welcome";

export interface EmailSender {
  email: string;
  name: string;
}

export interface OutboundEmail {
  subject: string;
  html: string;
  text: string;
  to: string;
}
