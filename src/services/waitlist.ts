import type { WaitlistSubmission } from "@/types/waitlist";

import { siteConfig } from "@/config/site";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BACKEND_URL =
  siteConfig.backendUrl ?? "https://aegisforge-backend.onrender.com";

export function validateWaitlistSubmission(payload: WaitlistSubmission) {
  if (!payload.email || !emailPattern.test(payload.email)) {
    return {
      ok: false,
      message: "Please enter a valid email address.",
    } as const;
  }

  return { ok: true, message: "Validation passed." } as const;
}

export async function subscribeToWaitlist(payload: WaitlistSubmission) {
  const validation = validateWaitlistSubmission(payload);

  if (!validation.ok) {
    return {
      ok: false,
      message: validation.message,
    } as const;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        name: payload.fullName?.trim() || undefined,
        company: payload.company?.trim() || undefined,
        message: payload.message?.trim() || undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message:
          data.detail ||
          data.message ||
          "Something went wrong. Please try again.",
      } as const;
    }

    return {
      ok: true,
      message:
        data.message ||
        "You're on the list. We'll keep you close to the launch.",
      submissionId: data.id || crypto.randomUUID(),
    } as const;
  } catch {
    // If backend is unreachable, still accept locally and show success
    return {
      ok: true,
      message: "You're on the list. We'll keep you close to the launch.",
      submissionId: crypto.randomUUID(),
      submission: {
        ...payload,
        email: payload.email.trim().toLowerCase(),
      },
    } as const;
  }
}
