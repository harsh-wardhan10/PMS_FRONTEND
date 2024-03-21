import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	list: [],
	payment: null,
	error: "",
	loading: false,
};

// ADD_ Payment to payslip
export const getNotificationList = createAsyncThunk(
	"leave/notifications",
	async () => {
		try {
			const { data } = await axios.get(
				`/notifications`
			);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);
export const updateNotifications = createAsyncThunk(
	"leavePolicy/updateNotifications",
	async ({ id, values }) => {
		try {
			const { data } = await axios({
				method: "put",

				url: `notifications/update/${id}`,
				data: {
					...values,
				},
			});
			return {
				data,
				message: "success",
			};
		} catch (error) {
			console.log(error.message);
			return {
				message: "error",
			};
		}
	}
);
const notificationSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
	},
    extraReducers: (builder) => {
        builder.addCase(getNotificationList.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getNotificationList.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload;
		});

		builder.addCase(getNotificationList.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
    }
});

export default notificationSlice.reducer;

