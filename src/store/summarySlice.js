import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMeteorites } from "../api/meteoriteApi";

export const fetchSummary = createAsyncThunk(
    "summary/fetch",
    async (arg, { getState }) => {
        const filters = getState().filters;
        return fetchMeteorites(filters);
    }
);

const summarySlice = createSlice({
    name: "summary",
    initialState: {
        items: [],
        totalPages: 1,
        currentPage: 1,
        pageSize: 20,
        totalItems: 0,
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSummary.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload;

                if (payload && Array.isArray(payload.items)) {
                    const { items = [], totalPages = 1, currentPage = 1, pageSize = 20, totalItems = 0 } = payload;
                    state.items = items;
                    state.totalPages = totalPages;
                    state.currentPage = currentPage;
                    state.pageSize = pageSize;
                    state.totalItems = totalItems;
                } else {
                    state.items = [];
                    state.totalPages = 1;
                    state.currentPage = 1;
                    state.totalItems = 0;
                }
            })
            .addCase(fetchSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default summarySlice.reducer;