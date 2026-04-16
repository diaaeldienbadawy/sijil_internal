import { combineReducers } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/api_slices/login-slice";
import { tendersSlice } from "./slices/api_slices/tenders-slice";
import { tenderSlice } from "./slices/api_slices/tender-slice";
import { tenderDetailsId } from "./slices/state_slices/tender-details-id";
import { popoverDialog } from "./slices/state_slices/popover-dialog-slice";

export default combineReducers({
    login:loginSlice.reducer,
    tenders:tendersSlice.reducer,
    tender:tenderSlice.reducer,
    tenderDetailsId:tenderDetailsId.reducer,
    popoverDialogOpen:popoverDialog.reducer
}) 