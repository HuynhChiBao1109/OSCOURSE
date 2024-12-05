import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchTransactionByAdmin,
  getPaymentStatusAPI,
  payCourseAPI,
} from "../../graphQL/transactionApi";

export const fetchTransactionByAdminAsync = createAsyncThunk(
  "transaction/fetchTransactionByAdminGraphQL",
  async ({ currentPage, pageSize }, { rejectWithValue }) => {
    try {
      const data = await fetchTransactionByAdmin({ currentPage, pageSize });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const payCourse = createAsyncThunk(
  "transaction/payCourse",
  async ({ courseId, childrenId }, { rejectWithValue }) => {
    try {
      const data = await payCourseAPI({ courseId, childrenId });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPaymentStatus = createAsyncThunk(
  "transaction/getPaymentStatus",
  async ({ content }, { rejectWithValue }) => {
    console.log("getPaymentStatus: " + content);
    try {
      const data = await getPaymentStatusAPI({ content });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState: {
    transactions: null,
    infoPayment: null,
  },
  reducers: {
    //handle save state internal
    setUser: (state, action) => {
      state.userInfo = action.payload;
      console.log("setUser", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionByAdminAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionByAdminAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionByAdminAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(payCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(payCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.infoPayment = action.payload;
        console.log(action.payload);
      })
      .addCase(payCourse.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getPaymentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getPaymentStatus.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

// export {
//     export funtion in extraReducers
// }

export default transactionSlice;
