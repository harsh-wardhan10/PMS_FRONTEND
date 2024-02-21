import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	attachment: '',
	loading: false,
    error:''
};

export const uploadReimbursementFile = createAsyncThunk(
	"reimbursement-files/uploadReimbursementFile",
	async (formData) => {
		try {
			const { data } = await axios.post(`reimbursement-files/`, formData, {
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
const uploadReimbursementAttachmentSlice = createSlice({
	name: "reimbursement",
	initialState,
	reducers: {
		clearuploadAttachment: (state) => {
			state.leave = null;
		},
	},
	extraReducers: (builder) => {
        // =============Upload Single Attachment=====================
		builder.addCase(uploadReimbursementFile.pending, (state) => {
			state.loading = true;
		});
        builder.addCase(uploadReimbursementFile.fulfilled, (state, action) => {
			state.loading = false;
			state.attachment = action.payload;
		});

		builder.addCase(uploadReimbursementFile.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default uploadReimbursementAttachmentSlice.reducer;
export const { clearuploadAttachment } = uploadReimbursementAttachmentSlice.actions;
