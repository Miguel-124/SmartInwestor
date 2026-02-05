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

export type GoogleLoginResponseDto = LoginResponseDto;

export type RegisterRequestDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type RegisterResponseDto = {
  ok: boolean;
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type MeResponseDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

export type MeModel = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};
