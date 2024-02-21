import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	attachment: '',
	loading: false,
    error:''
};

export const uploadDeductionFile = createAsyncThunk(
	"deductions-files/uploadDeductionFile",
	async (formData) => {
		try {
			const { data } = await axios.post(`deductions-files/`, formData, {
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
const uploadDeductionAttachmentSlice = createSlice({
	name: "deductions",
	initialState,
	reducers: {
		clearuploadAttachment: (state) => {
			state.leave = null;
		},
	},
	extraReducers: (builder) => {
        // =============Upload Single Attachment=====================
		builder.addCase(uploadDeductionFile.pending, (state) => {
			state.loading = true;
		});
        builder.addCase(uploadDeductionFile.fulfilled, (state, action) => {
			state.loading = false;
			state.attachment = action.payload;
		});

		builder.addCase(uploadDeductionFile.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default uploadDeductionAttachmentSlice.reducer;
export const { clearuploadAttachment } = uploadDeductionAttachmentSlice.actions;
