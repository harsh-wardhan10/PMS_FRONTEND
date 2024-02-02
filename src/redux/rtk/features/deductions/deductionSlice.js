import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	list: [],
	total: 0,
	deduction: null,
	error: "",
	loading: false,
};

// ADD_leave
export const addDeductions = createAsyncThunk(
	"leave/addDeductions",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url:   `deductions/`,
				data: {
					...values,
				},
			});
			toast.success("Deductions Created");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			toast.error("Error in creating try again");
			console.log(error.message);
			return {
				message: "error",
			};
		}
	}
);

const DeductionsSlice = createSlice({
	name: "deductions",
	initialState,
	reducers: {
		clearDedutionsApplication: (state) => {
			state.deduction = null;
		},
	},
	extraReducers: (builder) => {

		// 1) ====== builders for loadAllLeaveApplication ======

		builder.addCase(addDeductions.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addDeductions.fulfilled, (state, action) => {
			state.loading = false;
		});

		builder.addCase(addDeductions.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

	},
});

export default DeductionsSlice.reducer;
export const { clearDedutionsApplication } = DeductionsSlice.actions;
