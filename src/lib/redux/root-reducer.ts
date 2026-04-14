import { combineReducers } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/api_slices/login-slice";
import { tendersSlice } from "./slices/api_slices/tenders-slice";
import { tenderSlice } from "./slices/api_slices/tender-slice";

export default combineReducers({
    login:loginSlice.reducer,
    tenders:tendersSlice.reducer,
    tender:tenderSlice.reducer
}) 