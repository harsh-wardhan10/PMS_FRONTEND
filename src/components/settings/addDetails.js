import { Button, Card, Col, Form, Input, Row, Select, Tag, Typography } from "antd";
import { toast } from "react-toastify";
import getSetting from "../../api/getSettings";

import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import Loader from "../loader/loader";
import styles from "./AddDetails.module.css";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { Country, State, City }  from 'country-state-city';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadCompanyFile } from "../../redux/rtk/features/settings/settingSlice";
import { useDispatch } from "react-redux";
//Update Invoice API REQ

const updateInvoice = async (values) => {
	try {
		await axios({
			method: "put",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			url: `setting`,
			data: {
				...values,
			},
		});
		return "success";
		// return data;
	} catch (error) {
		console.log(error.message);
	}
};



const AddDetails = () => {
	const { Title } = Typography;
	const [loader, setLoader] = useState(false);
     const dispatch = useDispatch()
	const [form] = Form.useForm();
	const fileInputRef = useRef();
	const [initValues, setInitValues] = useState(null);
    const [allcountries, setAllcountries] = useState([])
	const [allStates, setallStates] = useState([])
	const [allCities, setallCities] = useState([])
	const [seletedCountry, setSelectedCountry] =useState()
	const [seletedState, setseletedState] =useState()
	const [seletedCity, setseletedCity] =useState()
    const [stateCheck, setstatecheck] = useState(false)
    const [cityCheck, setcityCheck] = useState(false)
	const [files, setFiles] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
	const handleOnChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size
            if (file.size > 5 * 1024 * 1024) {
                setError('File size exceeds 5 MB.');
                setSelectedFile(null);
            } else {
                setSelectedFile(file);
                setError('');
            }
        }
    };


	const onFinish = async (values) => {
		try{
		
		const selectedCountryarr=allcountries.filter(item => item.isoCode ===seletedCountry)
        const selectedCountryfinal= selectedCountryarr[0]?.name

		const seletedStatearr=allStates.filter(item => item.isoCode ===seletedState)
        const seletedStatefinal= seletedStatearr[0]?.name

		const seletedcityarr=allCities.filter(item => item.isoCode ===seletedCity)
        const seletedCityfinal= seletedcityarr[0]?.name

		const data={
			 ...values,
			 location: `${selectedCountryfinal} , ${seletedStatefinal},${seletedCityfinal}`,
			 attachment:`${values.company_name}_${selectedFile.name}`
		}
	

				const selectedFileName = selectedFile.name; // Get the current file name

				// Modify the file name
				const newFileName = `${values.company_name}_${selectedFileName}`; // Change this to the desired new file name

				// Create a new File object with the modified name
				const modifiedFile = new File([selectedFile], newFileName, {
				type: selectedFile.type,
				lastModified: selectedFile.lastModified,
			});
				const formData = new FormData();
				formData.append("files", modifiedFile); 
			
				dispatch(uploadCompanyFile(formData))
			     const resp = await updateInvoice(data);
			if (resp === "success") {
				toast.success("Invoice Updated Successfully");
				setInitValues({});
				setLoader(false);
				form.resetFields();
			}
		} catch (error) {
			console.log(error.message);
		}
		
	};

	const onFinishFailed = (errorInfo) => {
		toast.error("Something went wrong !");
		console.log("Failed:", errorInfo);
	};
		const handleRemoveFile = (fileIndex) => {
	  // Remove the file at the specified index
	  setFiles((prevFiles) => prevFiles.filter((file, index) => index !== fileIndex));
	};
const onSearch = (value) => {
	// console.log('search:', value);
  };
	const filterOption = (input, option) =>
	(option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  
	const onClickLoading = () => {
		setLoader(true);
	};
	useEffect(() => {
		getSetting().then((data) => setInitValues(data.result));
		setAllcountries(Country.getAllCountries())
	}, []);
	const { Option } = Select;
	return (
		<Fragment>
			{/* {console.log(Country.getAllCountries())}
            {console.log(State.getAllStates())} */}
			{/* {console.log('allStates',allStates)} */}
			<UserPrivateComponent permission={"create-setting"}>
				<Row className='mr-top' justify='center'>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={16}
						xl={16}
						className='border rounded column-design'>
						<Card bordered={false}>
							<Title level={4} className='m-2 mb-4 text-center'>
								Company Setting
							</Title>
							{initValues ? (
								<Form
									initialValues={{
										...initValues,
									}}
									form={form}
									name='basic'
									labelCol={{
										span: 7,
									}}
									labelWrap
									wrapperCol={{
										span: 16,
									}}
									onFinish={onFinish}
									onFinishFailed={onFinishFailed}
									autoComplete='off'>
									<Form.Item
										style={{ marginBottom: "10px" }}
										fields={[{ name: "Company Name" }]}
										label='Company Name'
										name='company_name'
										rules={[
											{
												required: true,
												message: "Please input Company name!",
											},
										]}>
										<Input />
									</Form.Item>
									<Form.Item
										style={{ marginBottom: "10px" }}
										fields={[{ name: "Tagline" }]}
										label='Tagline'
										name='tag_line'
										rules={[
											{
												required: true,
												message: "Please input Tagline!",
											},
										]}>
										<Input />
									</Form.Item>

									<Form.Item
										style={{ marginBottom: "10px" }}
										label='Location'
										name='location'
										rules={[
											{
												required: false,
												message: "Please input location!",
											},
										]}>
										<div className="flex"> 
										<Select
										    showSearch
                                            // defaultValue="Select Country"
                                            placeholder='Select Country'
                                            style={{ width: 200, marginRight: 16 }}
                                            onChange={(value)=>{
												setSelectedCountry(value)
												setallStates(State.getStatesOfCountry(value))
											    setstatecheck(true)
											}}
												
                                            value={seletedCountry}
											onSearch={onSearch}
                                           >
										 	{allcountries.map((item)=>{
													return  <Option  value={item.isoCode}>{item?.name}</Option>
												})}
                                          </Select>
										  {stateCheck &&  <Select
										    showSearch
                                            // defaultValue="Select State"
                                            placeholder='Select State'
                                            style={{ width: 200, marginRight: 16 }}
                                            onChange={(value)=>{
												setseletedState(value)
										        setallCities(City.getCitiesOfState(seletedCountry, value))
												setcityCheck(true)
											}}
                                            value={seletedState}
											onSearch={onSearch}
                                           >
											{/* {console.log('allStates',allStates)} */}
										 	{allStates ? allStates?.map((item)=>{
													return  <Option  value={item.isoCode}>{item?.name}</Option>
												}) :null}
                                          </Select>}
										  {cityCheck &&
										  <Select
										    showSearch
                                            // defaultValue="Select State"
                                            placeholder='Select City'
                                            style={{ width: 200, marginRight: 16 }}
                                            onChange={(value)=>{setseletedCity(value)}}
                                            value={seletedCity}
											onSearch={onSearch}
                                           >
											{/* {console.log('allCities',allCities)} */}
										 	{allCities ? allCities?.map((item)=>{
													return  <Option  value={item.isoCode}>{item?.name}</Option>
												}) :null}
                                          </Select> }
											</div>	
											<div> 
									  
											</div>
									</Form.Item>
									<Form.Item
												style={{ marginBottom: "10px" }}
												fields={[{ name: "Tagline" }]}
												label='Address Line'
												name='address'
												rules={[
													{
														required: true,
														message: "Please input Address Line",
													},
												]}>
												<Input />
									</Form.Item>
									<Form.Item
										style={{ marginBottom: "10px" }}
										label='Phone Number'
										name='phone'
										rules={[
											{
												required: true,
												message: "Please input Phone Number!",
											},
										]}>
										<Input />
									</Form.Item>

									<Form.Item
										style={{ marginBottom: "10px" }}
										label='Email Address'
										name='email'
										rules={[
											{
												required: true,
												message: "Please input Email Address!",
											},
										]}>
										<Input />
									</Form.Item>

									<Form.Item
										style={{ marginBottom: "10px" }}
										label='Website'
										name='website'
										rules={[
											{
												required: true,
												message: "Please input Website!",
											},
										]}>
										<Input />
									</Form.Item>

									<Form.Item
										style={{ marginBottom: "10px" }}
										label='Footer'
										name='footer'
										rules={[
											{
												required: true,
												message: "Please input Footer!",
											},
										]}>
										<Input />
									</Form.Item> 
									<Form.Item
												style={{ marginBottom: "20px" }}
												label='Company Logo'
												name='attachment'
												className="form_item_leave_page"
												>
													<input
														className='text-sm text-slate-500
																		file:mr-4 file:py-2 file:px-4
																		file:rounded-full file:border-0
																		file:text-sm file:font-semibold
																		file:bg-blue-50 file:text-blue-700
																		hover:file:bg-blue-100
																		mt-4 file:mt-0 file:ml-4
																		mb-4 file:mb-0 file:ml-4'
														type='file'
														id='csvFileInput'
														accept='image/jpeg,image/png'
														onChange={handleOnChange}
													/>
													{error && <p style={{ color: 'red' }}>{error}</p>}
													{selectedFile && <p>{selectedFile.name}</p>}
													{selectedFile && <img className="w-[150px] h-[150px] rounded-[100%] object-cover" src={URL.createObjectURL(selectedFile)} alt="file" />}
												</Form.Item>

									<Form.Item
										style={{ marginBottom: "10px" }}
										className={styles.addBtnContainer}>
										<Button
											type='primary'
											htmlType='submit'
											shape='round'
											size='large'
											loading={loader}
											onClick={onClickLoading}>
											Update Details
										</Button>
									</Form.Item>
								</Form>
							) : (
								<Loader />
							)}
						</Card>
					</Col>
				</Row>
			</UserPrivateComponent>
		</Fragment>
	);
};

export default AddDetails;
