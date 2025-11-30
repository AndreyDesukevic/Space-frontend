import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./filtersSlice";
import summaryReducer from "./summarySlice";

export const store = configureStore({
    reducer: {
        filters: filtersReducer,
        summary: summaryReducer
    }
});