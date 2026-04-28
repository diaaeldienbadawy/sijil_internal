import { combineReducers } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/api_slices/login-slice";
import { tendersSlice } from "./slices/api_slices/tenders-slice";
import { tenderSlice } from "./slices/api_slices/tender-slice";
import { tenderDetailsId } from "./slices/state_slices/tender-details-id";
import { popoverDialog } from "./slices/state_slices/popover-dialog-slice";
import { tenderFilterContentSlice } from "./slices/state_slices/tender-filter-content-slice";
import { analysisTendersIdsSlice } from "./slices/api_slices/analysis-tenders-slice";
import { judgesSlice } from "./slices/api_slices/judges-list-slice";
import { judgesFilterContentSlice } from "./slices/state_slices/judges-filter-content-slice";
import { judgesFiltersSlice } from "./slices/api_slices/judges-filters-slice";
import { judgementDetailsSlice } from "./slices/api_slices/judgement-details-slice";
import { judgementDetailsId } from "./slices/state_slices/judgement-details-id";

export default combineReducers({
    login:loginSlice.reducer,
    tenders:tendersSlice.reducer,
    tender:tenderSlice.reducer,
    tenderDetailsId:tenderDetailsId.reducer,
    judgementDetailsId:judgementDetailsId.reducer,
    popoverDialogOpen:popoverDialog.reducer,
    analysisTenderIds:analysisTendersIdsSlice.reducer,
    tenderFilterParameters: tenderFilterContentSlice.reducer,
    judges:judgesSlice.reducer,
    judgesFilter: judgesFilterContentSlice.reducer,
    judgesFiltersData: judgesFiltersSlice.reducer,
    judgementDetails:judgementDetailsSlice.reducer
}) 