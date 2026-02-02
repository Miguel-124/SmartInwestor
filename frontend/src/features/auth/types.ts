export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type RegisterRequestDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type RegisterResponseDto = {
  ok: boolean;
};

export type MeResponseDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string; // ISO
};

export type MeModel = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};
