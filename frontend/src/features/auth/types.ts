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
