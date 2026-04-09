import { combineReducers } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/api_slices/login-slice";

export default combineReducers({
    login:loginSlice.reducer
}) 