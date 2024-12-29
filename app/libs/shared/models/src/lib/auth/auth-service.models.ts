export interface AccessToken {
  access_token: string;
}

export interface AuthLocalLoginModel {
  email: string;
  password: string;
}

export type AuthLocalRegisterModel = AuthLocalLoginModel & {
  name: string;
};

export type AuthLocalRegisterResultModel = AccessToken;
