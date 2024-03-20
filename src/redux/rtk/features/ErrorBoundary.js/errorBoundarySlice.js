import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


export const addErrorBoundary = createAsyncThunk(
	"shift/addEmploymentStatus",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `fronEndErrorRoutes/`,
				data: {
					...values,
				},
			});
			// toast.success("Employment Status Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			// toast.error("Error in adding Employment Status try again");
			console.log(error.message);
			return {
				message: "error",
			};
		}
	}
);