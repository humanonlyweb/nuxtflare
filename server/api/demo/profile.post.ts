import { DEMO_TAKEN_EMAIL, demoProfileSchema } from "#shared/utils/schema-validation";

export default defineEventHandler(async (event) => {
  const { email } = await validateRequestBody(event, demoProfileSchema);

  if (email.toLowerCase() === DEMO_TAKEN_EMAIL) {
    throw Errors.conflict("That email is already registered.", {
      email: "That email is already registered.",
    });
  }

  return { saved: true };
});
