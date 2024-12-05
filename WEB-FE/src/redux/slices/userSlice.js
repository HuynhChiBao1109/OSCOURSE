import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  checkChildrenOrParentExistMutation,
  createChildrenMutation,
  createParentMutation,
  createUserMutation,
  deleteUserAPI,
  fetchUser,
  getUserById,
  loginByUser,
} from "../../graphQL/userApi";
import { api } from "../../services/api";

export const fetchUserGraphQL = createAsyncThunk(
  "users/fetchUserGraphQL", // Đổi tên action type này để tránh xung đột
  async ({ currentPage, pageSize, searchName, role }, { rejectWithValue }) => {
    try {
      const data = await fetchUser({ currentPage, pageSize, searchName, role });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserIDGraphQL = createAsyncThunk(
  "users/fetchUserIDGraphQL", // Đổi tên action type này để tránh xung đột
  async (userID, { rejectWithValue }) => {
    try {
      const data = await getUserById(userID);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUserGraphQL = createAsyncThunk(
  "user/createUserGraphQL",
  async (userData, { rejectWithValue }) => {
    try {
      return await createUserMutation(userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserGraphQL = createAsyncThunk(
  "user/deleteUserGraphQL",
  async (userID, { rejectWithValue }) => {
    try {
      return await deleteUserAPI(userID);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createParentGraphQL = createAsyncThunk(
  "user/createParentGraphQL",
  async (userData, { rejectWithValue }) => {
    try {
      const { confirmPassword, ...newUserData } = userData;
      return await createParentMutation(newUserData);
    } catch (error) {
      throw error;
    }
  }
);

export const createChildrenGraphQL = createAsyncThunk(
  "user/createChildrenGraphQL",
  async (userData, { rejectWithValue }) => {
    try {
      const { confirmPassword, ...newUserData } = userData;
      return await createChildrenMutation(newUserData);
    } catch (error) {
      throw error;
    }
  }
);

export const checkChildrenOrParentExistGraphQL = createAsyncThunk(
  "user/checkChildrenOrParentExistGraphQL",
  async (userData, { rejectWithValue }) => {
    try {
      return await checkChildrenOrParentExistMutation(userData);
    } catch (error) {
      throw error;
    }
  }
);

const fetchAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const fetchUsers = createAsyncThunk(
  "user/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllUsers();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    loading: false,
    error: null,
    userInfo: {
      name: "",
      password: "",
      email: "",
      id: "",
      role: "",
      status: "",
      date_of_birth: "",
      phone: "",
      avatar: "",
      token: "",
    },
    users: [],
    userInfoGraphQL: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
      console.log("setUser", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserGraphQL.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfoGraphQL = action.payload;
      })
      .addCase(fetchUserGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createUserGraphQL.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUserGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        // state.userInfoGraphQL = action.payload;
      })
      .addCase(createUserGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserIDGraphQL.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserIDGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfoGraphQL = action.payload;
      })
      .addCase(fetchUserIDGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUserGraphQL.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserGraphQL.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteUserGraphQL.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default userSlice;
