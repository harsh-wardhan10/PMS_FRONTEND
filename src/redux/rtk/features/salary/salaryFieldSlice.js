import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	list: [],
	clockIn: null,
	attendance: null,
	error: "",
	loading: false,
	singleAttendanceData:null,
	salaryHistoryRecord:[],
    getinitialSalaryHistoryRecordstate:[],
	salarySheetHistory:[],
	SalaryHistoryRecordId:[],
	salaryFileLocation:null
};
export const addBulkSalaryFields = createAsyncThunk(
	"salaryField/createbulkSalaryFields",
	async (values) => {
	
		try {

			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salaryField/?query=bulkpunch`,
				data: {
					data:values,
				},
			});
			toast.success("Bulk Salary Field Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			toast.error("Salary Field Entries Error");
			// toast.error("Error in adding Bulk Attendance try again");
			// console.log(error);
			return {
				message: error.response.data.message,
				data: error.response.data.results
			};
		}
	}
);
export const updateSalaryFields = createAsyncThunk(
	"salaryField/updateSalaryFieldRecord",
	async (values) => {
	
		try {

			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salaryField/updateSalaryFieldRecord`,
				data: {
					data:values,
				},
			});
			// toast.success("Bulk Salary Field Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			// toast.error("Salary Field Entries Error");
			// toast.error("Error in adding Bulk Attendance try again");
			// console.log(error);
			return {
				message: error.response.data.message,
				data: error.response.data.results
			};
		}
	}
);
export const loadAllBulkSalaryFields = createAsyncThunk(
	"salaryField/loadAllBulkSalaryFields",
	async () => {
		try {
			const { data } = await axios({
				method: "get",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salaryField/getAllbulkSalaryField?query=all`,
			});
			return data;
		} catch (error) {
			toast.error("Error in getting Salary Fields list try again");
			console.log(error.message);
			return {
				message: "error",
			};
		}
	}
);

export const createSalaryHistoryRecord = createAsyncThunk(
	"attendance/createSalaryHistoryRecord",
	async (values) => {
	
		try {

			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salary/createSalaryHistoryRecord`,
				data: {
					data:values,
				},
			});
			// toast.success("Bulk Salary History Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			// toast.error("Error in Bulk Salary History");
			// toast.error("Error in adding Bulk Attendance try again");
			// console.log(error);
			return {
				message: error.response.data.message,
				data: error.response.data.results
			};
		}
	}
);

export const createSalarySheetHistory = createAsyncThunk(
	"salary/createSalarySheetHistory",
	async (values) => {
	//    console.log('values',values)
		try {

			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salary/createSalarySheetHistory`,
				data: {
					data:values,
				},
			});
			// toast.success("Bulk Salary History Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			// toast.error("Error in Bulk Salary History");
			// toast.error("Error in adding Bulk Attendance try again");
			// console.log(error);
			return {
				message: error.response.data.message,
				data: error.response.data.results
			};
		}
	}
);

export const updateSalarySheetHistory = createAsyncThunk(
	"salary/updateSalarySheetHistory",
	async (values) => {
	//    console.log('values',values)
		try {

			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salary/updateSalarySheetHistory`,
				data: {
					data:values,
				},
			});
			// toast.success("Bulk Salary History Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			return {
				message: error.response.data.message,
				data: error.response.data.results
			};
		}
	}
);

export const getSalarySheetHistory = createAsyncThunk(
	"salary/getSalarySheetHistory",
	async (values) => {
		try {

			const { data } = await axios({
				method: "get",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salary/getSalarySheetHistory`,
			});
			// toast.success("Bulk Salary History Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {

			return {
				message: error.response.data.message,
				data: error.response.data.results
			};
		}
	}
);

export const getSalaryHistoryRecord = createAsyncThunk(
	"attendance/getSalaryHistoryRecord",
	async (values) => {
		try {

			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salary/getSalaryHistoryRecord`,
				data: {
					data:values,
				},
			});
			// toast.success("Bulk Salary History Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			// toast.error("Error in Bulk Salary History");
			// toast.error("Error in adding Bulk Attendance try again");
			// console.log(error);
			return {
				message: error.response.data.message,
				data: error.response.data.results
			};
		}
	}
);
export const getinitialSalaryHistoryRecord = createAsyncThunk(
	"salaryHistory/getinitialSalaryHistoryRecord",
	async (values) => {
		try {

			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salary/getSalaryHistoryRecord`,
				data: {
					data:values,
				},
			});
			// toast.success("Bulk Salary History Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			// toast.error("Error in Bulk Salary History");
			// toast.error("Error in adding Bulk Attendance try again");
			// console.log(error);
			return {
				message: error.response.data.message,
				data: error.response.data.results
			};
		}
	}
);
export const UploadSalaryHistoryRecords = createAsyncThunk(
	"salary/UploadSalaryHistoryRecords",
	async (values) => {
		try {

			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salary/UploadSalaryHistoryRecords`,
				data: {
					data:values,
				},
			});
			toast.success("Bulk Salary list Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			toast.error("Error in Bulk Salary list");
			// toast.error("Error in adding Bulk Attendance try again");
			// console.log(error);
			return {
				message: error.response.data.message,
				data: error.response.data.results
			};
		}
	}
);
export const getSalaryHistoryRecordById = createAsyncThunk(
	"salary/getSalaryHistoryRecordById",
	async (values) => {
		try {

			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `salary/getSalaryHistoryRecordById`,
				data: {
					data:values,
				},
			});
			// toast.success("Bulk Salary list Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			// toast.error("Error in Bulk Salary list");
			return {
				message: error.response.data.message,
				data: error.response.data.results
			};
		}
	}
);
export const uploadSalarySheetFile = createAsyncThunk(
	"salary-files/uploadSalarySheetFile",
	async (formData) => {
		console.log('formData', formData)
		try {
			const { data } = await axios.post(`salary-files/`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
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

const salaryFieldSlice = createSlice({
	name: "salaryField",
	initialState,
	reducers: {
		clearAttendance: (state) => {
			state.attendance = null;
		},
		clearAttendanceList: (state) => {
			state.list = null;
		},
	},
	extraReducers: (builder) => {


          // 1) ====== builders for loadAllBulkSalaryFields ======	
		builder.addCase(loadAllBulkSalaryFields.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllBulkSalaryFields.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload;
		});

		builder.addCase(loadAllBulkSalaryFields.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for getSalaryHistoryRecord ======	
		builder.addCase(getSalaryHistoryRecord.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getSalaryHistoryRecord.fulfilled, (state, action) => {
			state.loading = false;
			state.salaryHistoryRecord = action.payload.data.salaryHistoryRecords;
		});

		builder.addCase(getSalaryHistoryRecord.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	
		// 3) ====== builders for getinitialSalaryHistoryRecord ======	
			builder.addCase(getinitialSalaryHistoryRecord.pending, (state) => {
				state.loading = true;
			});
	
			builder.addCase(getinitialSalaryHistoryRecord.fulfilled, (state, action) => {
				state.loading = false;
				state.initialSalaryHistoryRecord = action.payload.data.salaryHistoryRecords;
			});
	
			builder.addCase(getinitialSalaryHistoryRecord.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload.message;
			});

			// 4) ====== builders for getSalarySheetHistory ======	
			builder.addCase(getSalarySheetHistory.pending, (state) => {
				state.loading = true;
			});
	
			builder.addCase(getSalarySheetHistory.fulfilled, (state, action) => {
				state.loading = false;
				state.salarySheetHistory = action.payload.data.data;
			});
	
			builder.addCase(getSalarySheetHistory.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload.message;
			});	


		    // 5) ====== builders for getSalaryHistoryRecordById ======	

				builder.addCase(getSalaryHistoryRecordById.pending, (state) => {
					state.loading = true;
				});

				builder.addCase(getSalaryHistoryRecordById.fulfilled, (state, action) => {
					state.loading = false;

					state.SalaryHistoryRecordId = action.payload.data.salaryHistoryRecords;
				});

				builder.addCase(getSalaryHistoryRecordById.rejected, (state, action) => {
					state.loading = false;
					state.error = action.payload.message;
				});	
                // 6) ====== builders for uploadSalarySheetFile ======	

				builder.addCase(uploadSalarySheetFile.pending, (state) => {
					state.loading = true;
				});

				builder.addCase(uploadSalarySheetFile.fulfilled, (state, action) => {
					state.loading = false;
					// console.log('action.payload',action.payload)
					state.salaryFileLocation = action.payload.data.location;
				});

				builder.addCase(uploadSalarySheetFile.rejected, (state, action) => {
					state.loading = false;
					state.error = action.payload.message;
				});	
				
				
	},
});

export default salaryFieldSlice.reducer;
export const { clearAttendance, clearAttendanceList } = salaryFieldSlice.actions;