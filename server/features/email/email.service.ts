import type { SendEmail } from "@cloudflare/workers-types";
import { log } from "evlog";

import type { EmailSender, EmailTemplate, OutboundEmail } from "./email.type";

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);

export class EmailService {
  constructor(
    private readonly transport: SendEmail | undefined, // undefined in local dev
    private readonly config: { from: EmailSender; siteUrl: string },
  ) {}

  async sendWelcome({ to, name }: { to: string; name: string }): Promise<boolean> {
    const { from, siteUrl } = this.config;
    const html = await this.render("welcome", {
      siteName: escapeHtml(from.name),
      appUrl: escapeHtml(siteUrl),
      name: escapeHtml(name),
    });

    return this.send({
      to,
      subject: `Welcome to ${from.name}`,
      html,
      text: `Welcome, ${name}! Thanks for signing up for ${from.name}.\n${siteUrl}`,
    });
  }

  private async send(message: OutboundEmail): Promise<boolean> {
    if (!this.transport) {
      log.warn("email", `no EMAIL binding — skipped "${message.subject}" to ${message.to}`);
      return false;
    }

    try {
      await this.transport.send({ from: this.config.from, ...message });
      return true;
    } catch (error) {
      log.error({ scope: "email", msg: "send failed", subject: message.subject, error });
      return false;
    }
  }

  private async render(template: EmailTemplate, vars: Record<string, string>): Promise<string> {
    const raw = await useStorage("assets:server").getItem(`emails/${template}.html`);
    if (typeof raw !== "string") throw Errors.internal(`Missing email template: ${template}`);
    return raw.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
  }
}
