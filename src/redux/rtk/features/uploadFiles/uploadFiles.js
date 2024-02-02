import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	attachment: '',
	loading: false,
    error:''
};

export const uploadAttachmentFile = createAsyncThunk(
	"files/uploadAttachmentFile",
	async (formData) => {
		try {
			const { data } = await axios.post(`files/`, formData, {
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
			toast.error("Error in creating, please try again");
			console.log(error.message);

			return {
				message: "error",
			};
		}
	}
);
const uploadAttachmentSlice = createSlice({
	name: "leaveApplication",
	initialState,
	reducers: {
		clearuploadAttachment: (state) => {
			state.leave = null;
		},
	},
	extraReducers: (builder) => {
        // =============Upload Single Attachment=====================
		builder.addCase(uploadAttachmentFile.pending, (state) => {
			state.loading = true;
		});
        builder.addCase(uploadAttachmentFile.fulfilled, (state, action) => {
			state.loading = false;
			state.attachment = action.payload;
		});

		builder.addCase(uploadAttachmentFile.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default uploadAttachmentSlice.reducer;
export const { clearuploadAttachment } = uploadAttachmentSlice.actions;
