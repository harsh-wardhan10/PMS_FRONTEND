import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	list: [],
	clockIn: null,
	attendance: null,
	error: "",
	loading: false,

};
export const loadAllAppSettings = createAsyncThunk(
	"appsetting/",
	async () => {
		try {
			const { data } = await axios({
				method: "get",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `setting/`,
			});
			return data;
		} catch (error) {
			console.log(error.message);
			return {
				message: "error",
			};
		}
	}
);

const appSettingSlice = createSlice({
    name: "appsetting",
    initialState,
    reducers: {
      clearAttendance: (state) => {
        state.list = null;
      },
      clearAttendanceList: (state) => {
        state.list = null;
      },
      setAttendanceList: (state, action) => {
        state.list = action.payload;
      }
    },
    extraReducers: (builder) => {

        builder.addCase(loadAllAppSettings.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllAppSettings.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload;
		});

		builder.addCase(loadAllAppSettings.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
    }
  });
  export const { clearAttendance, clearAttendanceList, setAttendanceList } = appSettingSlice.actions;

  export default appSettingSlice.reducer;