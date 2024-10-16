import { useEffect } from "react";
import { AxiosInstance } from "../configs/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  req_user,
  success_get_user,
  failuare_auth_user,
} from "../store/features/users/createUserSlice";
import { RootState } from "../store";
import { UserInter, UserSignInReturnInter } from "../types/users.types";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector<RootState>(
    (state) => state.user
  ) as UserInter;
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        dispatch(req_user());
        const { data } = await AxiosInstance.get<UserSignInReturnInter>(
          "users/current_user"
        );
        if (data) {
          dispatch(success_get_user({ name: data.name, email: data.email }));
        }
      } catch (error: any) {
        dispatch(
          failuare_auth_user(
            error?.response?.data[0]?.msg ||
              "Something went wrong please try again!"
          )
        );
      }
    };
    getCurrentUser();
  }, []);

  return { user, loading, error };
}
