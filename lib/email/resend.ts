import "server-only";
import { Resend } from "resend";

export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);

export const resend = isEmailConfigured
  ? new Resend(process.env.RESEND_API_KEY)
  : undefined;
