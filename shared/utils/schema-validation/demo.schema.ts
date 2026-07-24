import { z } from "zod";

export const DEMO_TAKEN_EMAIL = "taken@example.com";

export const demoProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Use at least 2 characters."),
  email: z.email("Enter a valid email address."),
  headline: z.string().trim().max(80, "Keep it under 80 characters.").default(""),
  acceptTerms: z.boolean().refine((accepted) => accepted, "You must accept the terms."),
});

export type DemoProfileInput = z.input<typeof demoProfileSchema>;
