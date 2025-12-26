export type User = {
  id: number;
  email: string;
  password: string;
  created_at: Date;
};

export type RegisterDto = {
  email: string;
  password: string;
  confirm_password: string;
  name?: string;
};

export type LoginDto = {
  email: string;
  password: string;
};
