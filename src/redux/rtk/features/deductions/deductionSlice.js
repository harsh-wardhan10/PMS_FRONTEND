import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	list: [],
	total: 0,
    deductionHistory: null,
	deduction: null,
	error: "",
	loading: false,
};

// ADD_leave
export const addDeductions = createAsyncThunk(
	"deduction/addDeductions",
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
export const loadDeductionsByStatus = createAsyncThunk(
	"leave/loadDeductionsByStatus",
	async ({ status, page, limit }) => {
		try {
			const { data } = await axios.get(
				`deductions?page=${page}&count=${limit}&status=${status}`
			);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const loadAllDeductionsApplication = createAsyncThunk(
	"leave/loadAllDeductionsApplication",
	async () => {
		try {
			const { data } = await axios.get(`deductions?query=all`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);
export const loadSingelDeductionsApplication = createAsyncThunk(
	"leave/loadSingelDeductionsApplication",
	async (id) => {
		try {
			const data = await axios.get(`deductions/${id}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);
export const reviewDeductionsApplication = createAsyncThunk(
	"leave/reviewDeductionsApplication",
	async ({ id, values }) => {
		try {
			const { data } = await axios({
				method: "put",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `deductions/${id}`,
				data: {
					...values,
				},
			});

			toast.success("Reimbursement Approved");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			toast.error("Error in approving try again");
			console.log(error.message);
		}
	}
);
export const loadSingleDeductionsHistory = createAsyncThunk(
	"leave/loadSingleDeductionsHistory",
	async (id) => {
		try {
			const { data } = await axios.get(`deductions/${id}/deductionHistory`);
			return data;
		} catch (error) {
			console.log(error.message);
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
            // 2) ====== builders for loadDeductionsByStatus ======

            builder.addCase(loadDeductionsByStatus.pending, (state) => {
                state.loading = true;
            });

            builder.addCase(loadDeductionsByStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            });

            builder.addCase(loadDeductionsByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });

            // 3) ====== builders for loadAllDeductionsApplication ======

            builder.addCase(loadAllDeductionsApplication.pending, (state) => {
                state.loading = true;
            });

            builder.addCase(loadAllDeductionsApplication.fulfilled, (state, action) => {
                state.loading = false;
                // console.log('action.payload',action.payload)
                state.list = action.payload;
            });

            builder.addCase(loadAllDeductionsApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });

          // 4) ====== builders for loadSingelDeductionsApplication ======

            builder.addCase(loadSingelDeductionsApplication.pending, (state) => {
                state.loading = true;
            });

            builder.addCase(loadSingelDeductionsApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.deduction = action.payload.data;
            });

            builder.addCase(loadSingelDeductionsApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });

            // 5) ====== builders for reviewDeductionsApplication ======

            builder.addCase(reviewDeductionsApplication.pending, (state) => {
                state.loading = true;
            });

            builder.addCase(reviewDeductionsApplication.fulfilled, (state, action) => {
                state.loading = false;
            });

            builder.addCase(reviewDeductionsApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });

                // 6) ====== builders for loadSingleDeductionsHistory ======

            builder.addCase(loadSingleDeductionsHistory.pending, (state) => {
                state.loading = true;
            });

            builder.addCase(loadSingleDeductionsHistory.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                state.deductionHistory = action.payload;
            });

            builder.addCase(loadSingleDeductionsHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
	},
});

export default DeductionsSlice.reducer;
export const { clearDedutionsApplication } = DeductionsSlice.actions;
