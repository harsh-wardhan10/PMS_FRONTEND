import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	list: [],
	total: 0,
    reimbursementHistory: null,
	reimbursement: null,
	error: "",
	loading: false,
};

// ADD_leave
export const addReimbursement = createAsyncThunk(
	"leave/addReimbursement",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url:   `reimbursement/`,
				data: {
					...values,
				},
			});
			toast.success("Reimbursement Created");
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
export const loadReimbursementByStatus = createAsyncThunk(
	"leave/loadReimbursementByStatus",
	async ({ status, page, limit }) => {
		try {
			const { data } = await axios.get(
				`reimbursement?page=${page}&count=${limit}&status=${status}`
			);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const loadAllReimbursementApplication = createAsyncThunk(
	"leave/loadAllReimbursementApplication",
	async () => {
		try {
			const { data } = await axios.get(`reimbursement?query=all`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);
export const loadSingelReimbursementApplication = createAsyncThunk(
	"leave/loadSingelReimbursementApplication",
	async (id) => {
		try {
			const data = await axios.get(`reimbursement/${id}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);
export const reviewReimbursementApplication = createAsyncThunk(
	"leave/reviewReimbursementApplication",
	async ({ id, values }) => {
		try {
			const { data } = await axios({
				method: "put",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `reimbursement/${id}`,
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
export const loadSingleReimbursementHistory = createAsyncThunk(
	"leave/loadSingleReimbursementHistory",
	async (id) => {
		try {
			const { data } = await axios.get(`reimbursement/${id}/reimbursementHistory`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

const ReimbursementSlice = createSlice({
	name: "reimbursement",
	initialState,
	reducers: {
		clearReimbursementApplication: (state) => {
			state.reimbursement = null;
		},
	},
	extraReducers: (builder) => {

		// 1) ====== builders for addReimbursement ======

		builder.addCase(addReimbursement.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addReimbursement.fulfilled, (state, action) => {
			state.loading = false;
		});

		builder.addCase(addReimbursement.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

            // 2) ====== builders for loadReimbursementByStatus ======

            builder.addCase(loadReimbursementByStatus.pending, (state) => {
                state.loading = true;
            });

            builder.addCase(loadReimbursementByStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            });

            builder.addCase(loadReimbursementByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });

        // 3) ====== builders for loadAllReimbursementApplication ======

		builder.addCase(loadAllReimbursementApplication.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllReimbursementApplication.fulfilled, (state, action) => {
			state.loading = false;
            // console.log('action.payload',action.payload)
			state.list = action.payload;
		});

		builder.addCase(loadAllReimbursementApplication.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

        	// 4) ====== builders for loadSingelReimbursementApplication ======

		builder.addCase(loadSingelReimbursementApplication.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadSingelReimbursementApplication.fulfilled, (state, action) => {
			state.loading = false;
			state.reimbursement = action.payload.data;
		});

		builder.addCase(loadSingelReimbursementApplication.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

        // 5) ====== builders for reviewReimbursementApplication ======

		builder.addCase(reviewReimbursementApplication.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(reviewReimbursementApplication.fulfilled, (state, action) => {
			state.loading = false;
		});

		builder.addCase(reviewReimbursementApplication.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

        	// 6) ====== builders for loadSingleReimbursementHistory ======

		builder.addCase(loadSingleReimbursementHistory.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadSingleReimbursementHistory.fulfilled, (state, action) => {
			console.log(action.payload);
			state.loading = false;
			state.reimbursementHistory = action.payload;
		});

		builder.addCase(loadSingleReimbursementHistory.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default ReimbursementSlice.reducer;
export const { clearReimbursementApplication } = ReimbursementSlice.actions;
