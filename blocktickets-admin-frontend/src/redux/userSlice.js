import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allUsers: [],
  loading: {
    isLoading: false,
    message: "",
  },
};
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      return {
        ...state,
        allUsers: action.payload,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: {
          isLoading: action.payload.loading,
          message: action.payload.message,
        },
      };
    },
  },
});

export const { setAllUsers } = userSlice.actions;

export default userSlice.reducer;
