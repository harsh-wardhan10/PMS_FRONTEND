import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	list: [],
	total: 0,
    taxHistory: null,
	tax: null,
	error: "",
	loading: false,
};

// ADD_leave
export const addTax = createAsyncThunk(
	"leave/addTax",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url:   `tax/`,
				data: {
					...values,
				},
			});
			toast.success("Tax Created");
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

export const loadAllTaxes = createAsyncThunk(
	"leave/loadAllTaxes",
	async () => {
		try {
			const { data } = await axios.get(`tax?query=all`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);
export const updateTax = createAsyncThunk(
	"tax/updateTax",
	async ({ id, values }) => {
		try {
			const { data } = await axios({
				method: "put",

				url: `tax/${id}`,
				data: {
					...values,
				},
			});
			toast.success("Tax Updated");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			toast.error("Error in updating tax try again");
			console.log(error.message);
			return {
				message: "error",
			};
		}
	}
);


const TaxlistSlice = createSlice({
	name: "taxlist",
	initialState,
	reducers: {
		clearTaxApplication: (state) => {
			state.tax = null;
		},
	},
	extraReducers: (builder) => {

		// 1) ====== builders for addReimbursement ======

		builder.addCase(addTax.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addTax.fulfilled, (state, action) => {
			state.loading = false;
		});

		builder.addCase(addTax.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});


        // 2) ====== builders for loadAllTaxes ======

		builder.addCase(loadAllTaxes.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllTaxes.fulfilled, (state, action) => {
			state.loading = false;
            // console.log('action.payload',action.payload)
			state.list = action.payload;
		});

		builder.addCase(loadAllTaxes.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

        // 3) ====== builders for updateTax ======

		builder.addCase(updateTax.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(updateTax.fulfilled, (state, action) => {
			state.loading = false;
		});

		builder.addCase(updateTax.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

	},
});

export default TaxlistSlice.reducer;
export const { clearTaxApplication } = TaxlistSlice.actions;
