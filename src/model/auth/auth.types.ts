export interface RequestOtpBody {
  email: string;
}

export interface VerifyOtpBody {
  email: string;
  otp: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  confirm_password: string;
  created_at?: Date;
}
