import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../lib/api";
import { PAGINATION } from "../../config/constants";

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (dealerId) => {
    const result = await api.getAllOrders(dealerId);
    return result.data;
  }
);

export const fetchOrdersByStatus = createAsyncThunk(
  "orders/fetchByStatus",
  async ({ dealerId, status }) => {
    const result = await api.getOrdersByStatus(dealerId, status);
    return result.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }) => {
    const result = await api.updateOrderStatus(orderId, status);
    return result.data;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    searchQuery: "",
    currentPage: 1,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    nextPage: (state) => {
      const filteredOrders = filterOrders(state.orders, state.searchQuery);
      const totalPages = Math.ceil(filteredOrders.length / PAGINATION.ITEMS_PER_PAGE);
      if (state.currentPage < totalPages) {
        state.currentPage += 1;
      }
    },
    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrdersByStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.orderId === action.payload.orderId
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

// Helper function for filtering
function filterOrders(orders, searchQuery) {
  if (!searchQuery) return orders;
  
  return orders.filter((order) =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerMobile?.includes(searchQuery)
  );
}

// Selectors
export const selectFilteredOrders = (state) => {
  return filterOrders(state.orders.orders, state.orders.searchQuery);
};

export const selectPaginatedOrders = (state) => {
  const filtered = selectFilteredOrders(state);
  const startIndex = (state.orders.currentPage - 1) * PAGINATION.ITEMS_PER_PAGE;
  return filtered.slice(startIndex, startIndex + PAGINATION.ITEMS_PER_PAGE);
};

export const selectTotalPages = (state) => {
  const filtered = selectFilteredOrders(state);
  return Math.ceil(filtered.length / PAGINATION.ITEMS_PER_PAGE);
};

export const { setSearchQuery, setCurrentPage, nextPage, previousPage } = ordersSlice.actions;

export default ordersSlice.reducer;
