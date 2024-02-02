import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attendanceList: [],
  error: "",
  loading: false,
  totalAbsenties:''
};

const attendanceListSlice = createSlice({
  name: "cl",
  initialState,
  reducers: {
    clearAttendance: (state) => {
      state.attendance = null;
    },
    clearAttendanceList: (state) => {
      state.attendanceList = null;
    },
    setAttendanceList: (state, action) => {
      state.attendanceList = action.payload;
    }
    ,
  },
});

export const { clearAttendance, clearAttendanceList, setAttendanceList } = attendanceListSlice.actions;

export default attendanceListSlice.reducer;