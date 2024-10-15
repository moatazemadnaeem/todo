import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserInter, UserSignInReturnInter } from "../../../types/users.types";

const initialState: UserInter = {
  loading: false,
  user: null,
  error: "",
  token: null,
  status: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    req_user: (state) => {
      state.loading = true;
    },
    success_get_user: (state) => {
      state.loading = false;
      state.status = true;
    },
    success_signin: (state, action: PayloadAction<UserSignInReturnInter>) => {
      state.loading = false;
      state.user = {
        name: action.payload.name,
        email: action.payload.email,
      };
      state.token = action.payload.token;
      sessionStorage.setItem("jwt", action.payload.token);
      state.status = true;
    },
    success_signup: (state) => {
      state.loading = false;
      state.status = true;
    },
    failuare_auth_user: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.status = false;
      state.user = null;
      state.token = null;
      if (sessionStorage.getItem("jwt")) {
        sessionStorage.removeItem("jwt");
      }
    },
    logout_user: (state) => {
      state.user = null;
      state.token = null;
      state.status = false;
      sessionStorage.removeItem("jwt");
    },
  },
});
export default userSlice.reducer;
export const {
  req_user,
  success_get_user,
  success_signin,
  failuare_auth_user,
  logout_user,
  success_signup,
} = userSlice.actions;
