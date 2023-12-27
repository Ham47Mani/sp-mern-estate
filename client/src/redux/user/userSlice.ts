/* eslint-disable @typescript-eslint/no-unused-vars */

import { createSlice } from "@reduxjs/toolkit"
import { USER } from "../../utility/types";

// Define the type of USER
export interface USERREDUCER {
  currentUSer: USER | null,
  error: string | null,
  loading: boolean,
}
// Create an initial state
const initialState: USERREDUCER =  {
  currentUSer: null,
  error: null,
  loading: false
}

// Create slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {// Sign in started
      state.loading = true
    },
    signInSuccess: (state, action) => {// Success login
      state.currentUSer = action.payload,
      state.loading = false,
      state.error = null
    },
    signInFailure: (state, action) => {// Failure login
      state.currentUSer = null,
      state.error = action.payload,
      state.loading = false
    }
  }
});

export const {signInStart, signInSuccess, signInFailure} = userSlice.actions;

export default userSlice.reducer;