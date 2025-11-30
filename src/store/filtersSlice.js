import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    yearFrom: "",
    yearTo: "",
    recClass: "",
    nameContains: "",
    sortField: "year",
    sortOrder: "asc",
    page: 1,
    pageSize: 20
};

export const filtersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        updateFilters: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetFilters: () => initialState
    }
});

export const { updateFilters, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;