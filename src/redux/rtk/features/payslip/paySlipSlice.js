import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	list: [],
	payslip: null,
	error: "",
	loading: false,
	monthYear:''
};

// ADD_ payroll
export const generatePayslipRequest = createAsyncThunk(
	"payslip/generatePayslipRequest",
	async (values) => {
        // console.log('values', values)
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `payslipRequest/generatePayslipRequest`,
				data: values,
			});
			toast.success("Payslip Request Created Successfully");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			toast.error("Error in adding payslip try again");
			console.log(error.message);
			return {
				message: "error",
			};
		}
	}
);
export const loadAllPayslipRequest = createAsyncThunk(
	"payslip/loadAllPayslipRequest",
	async () => {
		try {
			const { data } = await axios.get(`payslipRequest/all`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const updatePayslipRequest = createAsyncThunk(
	"payslip/updatePayslipRequest",
	async (value) => {
        // console.log('value',value)
		try {
            const { data } = await axios({
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                url: `payslipRequest/${value.selectedId}`,
                data: value,
            });
            toast.success("PaySlip Updated Successfully");
            return {
                data,
                message: "success",
            };
		} catch (error) {
			console.log(error.message);
		}
	}
);
export const updatePayslipRequestAttachment = createAsyncThunk(
	"payslip/updatePayslipRequestAttachment",
	async (value) => {
        // console.log('value',value)
		try {
            const { data } = await axios({
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                url: `payslipRequest/attachment/${value.id}`,
                data: value,
            });
            // toast.success("PaySlip Updated Successfully");
            return {
                data,
                message: "success",
            };
		} catch (error) {
			console.log(error.message);
		}
	}
)
export const uploadPayslipFile = createAsyncThunk(
	"payslip/uploadPayslipFile",
	async (formData) => {
		try {
			const { data } = await axios.post(`payslipRequest/`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			// toast.success("Leave Application Created");

			return {
				data,
				message: "success",
			};
		} catch (error) {
			// toast.error("Error in creating, please try again");
			console.log(error.message);

			return {
				message: "error",
			};
		}
	}
);
export const payslipDate= createAsyncThunk(
	"payslip/uploadPayslipFile",
	async (data) => {
		try {
			 return data
		} catch (error) {
			// toast.error("Error in creating, please try again");
			
		}
	}
);
const payslipSlice = createSlice({
	name: "payslip",
	initialState,
	reducers: {
		clearPayroll: (state) => {
		},
		updatePayslip: (state, { payload: { id, value, key } }) => {
	
		},
	},
	extraReducers: (builder) => {
                
                 // 1) ====== builders for loadAllPayslipRequest ======

                builder.addCase(loadAllPayslipRequest.pending, (state) => {
                    state.loading = true;
                });

                builder.addCase(loadAllPayslipRequest.fulfilled, (state, action) => {
                    state.loading = false;
                    state.list = action.payload;
                });

                builder.addCase(loadAllPayslipRequest.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload.message;
                });
				// 1) ====== builders for payslipDate ======

				builder.addCase(payslipDate.pending, (state) => {
					state.loading = true;
				});

				builder.addCase(payslipDate.fulfilled, (state, action) => {
					state.loading = false;
					state.monthYear = action.payload;
				});

				builder.addCase(payslipDate.rejected, (state, action) => {
					state.loading = false;
					state.error = action.payload.message;
				});
			},
});

export default payslipSlice.reducer;
export const { clearPayroll, updatePayslip } = payslipSlice.actions;