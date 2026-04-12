import { combineReducers } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/api_slices/login-slice";
import { tendersSlice } from "./slices/api_slices/tenders-slice";

export default combineReducers({
    login:loginSlice.reducer,
    tenders:tendersSlice.reducer
}) 