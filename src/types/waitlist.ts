export interface WaitlistSubmission {
  fullName?: string;
  email: string;
  company?: string;
  message?: string;
}

export interface WaitlistResponse {
  ok: boolean;
  message: string;
  submissionId?: string;
}
