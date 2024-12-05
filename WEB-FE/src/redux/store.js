import { configureStore } from "@reduxjs/toolkit";
import userLoginSlice from "./slices/userLoginSlice";
import userSlice from "./slices/userSlice";
import courseSlice from "./slices/courseSlice";
import transactionSlice from "./slices/transactionSlice";
// import usersSlice from "./slices/userSlice";

const store = configureStore({
  reducer: {
    userLoginSlice: userLoginSlice.reducer,
    userSlice: userSlice.reducer,
    courseSlice: courseSlice.reducer,
    transactionSlice: transactionSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
