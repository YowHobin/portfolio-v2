"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }

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
      return { error: error.message || "Failed to send email. Please try again." };
    }

    return { success: true };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
