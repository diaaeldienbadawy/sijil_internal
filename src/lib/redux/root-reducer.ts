import { combineReducers } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/api_slices/login-slice";
import { tendersSlice } from "./slices/api_slices/tenders-slice";
import { tenderSlice } from "./slices/api_slices/tender-slice";
import { tenderDetailsId } from "./slices/state_slices/tender-details-id-slice";
import { popoverDialog } from "./slices/state_slices/popover-dialog-slice";
import { tenderFilterContentSlice } from "./slices/state_slices/tender-filter-content-slice";
import { judgesSlice } from "./slices/api_slices/judges-list-slice";
import { judgesFilterContentSlice } from "./slices/state_slices/judges-filter-content-slice";
import { judgesFiltersSlice } from "./slices/api_slices/judges-filters-slice";
import { judgementDetailsSlice } from "./slices/api_slices/judgement-details-slice";
import { judgementDetailsId } from "./slices/state_slices/judgement-details-id-slice";
import { updatesLoginSlice } from "./slices/api_slices/updates-login-slice";
import { companyUpdatesSlice } from "./slices/api_slices/company-updates-slice";
import { accessTokensSlice } from "./slices/state_slices/access-tokens-slice";
import { currentPageTabSlice } from "./slices/state_slices/current-page-tab-slice";

export default combineReducers({
    //client states
    accessTokens : accessTokensSlice.reducer,
    judgementDetailsId:judgementDetailsId.reducer,
    judgesFiltersData: judgesFiltersSlice.reducer,
    popoverDialogOpen:popoverDialog.reducer,
    tenderDetailsId:tenderDetailsId.reducer,
    tenderFilterParameters: tenderFilterContentSlice.reducer,
    currentPageTab : currentPageTabSlice.reducer,

    //api states
    login:loginSlice.reducer,
    tender:tenderSlice.reducer,
    tenders:tendersSlice.reducer,

    companyUpdates: companyUpdatesSlice.reducer,
    updatesLogin:updatesLoginSlice.reducer,

    judgementDetails:judgementDetailsSlice.reducer,
    judgesFilter: judgesFilterContentSlice.reducer,
    judges:judgesSlice.reducer,
}) 