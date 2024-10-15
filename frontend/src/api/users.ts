import { AppDispatch } from "../store";
import * as userActions from "../store/features/users/createUserSlice";
import { UserSignInInter } from "../types/users.types";
import { signInUser, signUpUser } from "../services/users";
export const signInApi = async (
  reqBody: UserSignInInter,
  dispatch: AppDispatch
) => {
  try {
    dispatch(userActions.req_user());
    const data = await signInUser(reqBody);
    dispatch(userActions.success_signin(data));

    return data;
  } catch (error: any) {
    dispatch(userActions.failuare_auth_user(error));
    throw error;
  }
};
export const signUpUserApi = async (
  reqBody: UserSignInInter,
  dispatch: AppDispatch
) => {
  try {
    dispatch(userActions.req_user());
    const data = await signUpUser(reqBody);
    dispatch(userActions.success_signup());
    return data;
  } catch (error: any) {
    dispatch(userActions.failuare_auth_user(error));
    throw error;
  }
};
