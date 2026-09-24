import { db } from "@youly-en/db";
import * as schema from "@youly-en/db/schema/auth";
import { env } from "@youly-en/env/server";
import { isValidE164IranPhone } from "@youly-en/utils/phone";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber } from "better-auth/plugins";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: schema,
  }),
  trustedOrigins: [env.WEB_URL],
  emailAndPassword: {
    enabled: false,
  },
  phoneNumberValidator: (phone: string) => isValidE164IranPhone(phone),
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      console.log(`[DEV] verify link for ${user.email}: ${url}`);
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300,
      sendOTP: ({ phoneNumber, code }) => {
        console.log(`[DEV OTP] ${phoneNumber} -> ${code}`);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => `${phoneNumber}@temp.myapp.local`,
      },
    }),
  ],
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", input: false }, // user | admin
    },
  },
});
