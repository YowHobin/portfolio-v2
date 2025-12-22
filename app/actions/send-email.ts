"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type RecaptchaVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

async function verifyRecaptcha(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) return false;

  const data = (await res.json()) as RecaptchaVerifyResponse;
  return data.success === true;
}

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const recaptchaToken = formData.get("recaptchaToken") as string;

  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }

  if (!recaptchaToken) {
    return { error: "reCAPTCHA verification is required." };
  }

  try {
    const ok = await verifyRecaptcha(recaptchaToken);
    if (!ok) {
      return { error: "reCAPTCHA verification failed. Please try again." };
    }
  } catch (error) {
    console.error("reCAPTCHA verify error:", error);
    return { error: "reCAPTCHA verification failed. Please try again." };
  }

  void (async () => {
    try {
      const { error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>",
        to: process.env.OWNER_EMAIL || "lenardroyarellano@gmail.com",
        subject: `New Message from Portfolio: ${name}`,
        replyTo: email,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      });

      if (error) {
        console.error("Resend error:", error);
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  })();

  return { success: true };
}
