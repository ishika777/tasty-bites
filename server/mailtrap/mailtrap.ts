import dotenv from "dotenv"
dotenv.config()
import { MailtrapClient } from "mailtrap";

export const client = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN!,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "TastyBites",
};