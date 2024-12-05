import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  forgotPass,
  loginByChildren,
  loginByUser,
} from "../../graphQL/userApi";

export const userLoginSlice = createSlice({
  name: "userLoginSlice",
  initialState: {
    userInfo: {
      id: null,
      name: "",
      email: "",
      password: "",
      role: "user",
      token: "",
      ninh: "",
      avatar: "",
      date_of_birth: null,
      phone: "",
      status: "",
    },
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
      //api handle here
      // .addCase(fetchApiSaveFileToContract.fulfilled, (state, action) => {
      //     state.data.GetHopDongs.nodes[0].fileDinhKems.unshift(action.payload);
      //   })
      .addCase(loginUserGraphQL.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        const user = {
          ...action.payload.loginByUser.User,
          token: action.payload.loginByUser.token,
        };
        state.userInfo = user;
      })
      .addCase(loginUserGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginChildrenGraphQL.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginChildrenGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.loginByChildren.Children;
      })
      .addCase(loginChildrenGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const loginUserGraphQL = createAsyncThunk(
  "user/loginUserGraphQL",
  async (userData, { rejectWithValue }) => {
    try {
      return await loginByUser(userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginChildrenGraphQL = createAsyncThunk(
  "user/loginChildrenGraphQL",
  async (userData, { rejectWithValue }) => {
    try {
      return await loginByChildren(userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      return await forgotPass(email.email);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export {
//     export funtion in extraReducers
// }

export default userLoginSlice;
