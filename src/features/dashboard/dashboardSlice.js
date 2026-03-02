import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (dealerId) => {
    const result = await api.getAllDashboardData(dealerId);
    return result.data;
  }
);

export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (dealerId) => {
    const result = await api.getDashboardSummary(dealerId);
    return result.data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: null,
    summary: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
