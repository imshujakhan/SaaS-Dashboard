import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchDealerProfile = createAsyncThunk(
  "dealer/fetchProfile",
  async (dealerId) => {
    const result = await api.getDealerProfile(dealerId);
    return result.data;
  }
);

export const loginDealer = createAsyncThunk(
  "dealer/login",
  async ({ email, password }) => {
    const result = await api.login(email, password);
    if (result.success) {
      localStorage.setItem("dealerId", result.data.dealerId);
      return result.data;
    }
    throw new Error(result.error);
  }
);

const dealerSlice = createSlice({
  name: "dealer",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("dealerId"),
  },
  reducers: {
    logout: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
      localStorage.removeItem("dealerId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDealerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDealerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchDealerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginDealer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginDealer.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginDealer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = dealerSlice.actions;
export default dealerSlice.reducer;
