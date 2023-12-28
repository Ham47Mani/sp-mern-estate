/* eslint-disable @typescript-eslint/no-unused-vars */

import { createSlice } from "@reduxjs/toolkit"
import { USER } from "../../utility/types";

// Define the type of USER
export interface USERREDUCER {
  currentUser: USER | null,
  error: string | null,
  loading: boolean,
}
// Create an initial state
const initialState: USERREDUCER =  {
  currentUser: null,
  error: null,
  loading: false
}

// Create slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetError: (state) => {// Reset Error
      state.error = null
    },
    signInStart: (state) => {// Sign in started
      state.loading = true
    },
    signInSuccess: (state, action) => {// Success login
      state.currentUser = action.payload,
      state.loading = false,
      state.error = null
    },
    signInFailure: (state, action) => {// Failure login
      state.currentUser = null,
      state.error = action.payload,
      state.loading = false
    }
  }
});

export const {resetError, signInStart, signInSuccess, signInFailure} = userSlice.actions;

export default userSlice.reducer;