import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	attachment: '',
	loading: false,
    error:''
};

export const uploadCompanyFile = createAsyncThunk(
	"company-files/uploadCompanyFile",
	async (formData) => {
		try {
			const { data } = await axios.post(`company-files/`, formData, {
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
const uploadSettingAttachmentSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		clearuploadAttachment: (state) => {
			state.leave = null;
		},
	},
	extraReducers: (builder) => {
        // =============Upload Single Attachment=====================
	},
});

export default uploadSettingAttachmentSlice.reducer;
export const { clearuploadAttachment } = uploadSettingAttachmentSlice.actions;
