export interface UserBaseInter {
  name: string;
  email: string;
}

export interface UserInter {
  loading: boolean;
  status: boolean;
  user: UserBaseInter | null;
  error: string;
  token: string | null;
}

export interface UserSignInInter extends UserBaseInter {}
export interface UserSignUpInter extends UserBaseInter {
  name: string;
}
export interface UserSignInReturnInter extends UserBaseInter {
  token: string;
}
