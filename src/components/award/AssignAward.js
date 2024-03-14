import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table, Typography } from "antd";

import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import ViewBtn from "../Buttons/ViewBtn";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { useDispatch, useSelector } from "react-redux";
import {
	addSingleAward,
	loadAllAward,
} from "../../redux/rtk/features/award/awardSlice";
import { addAward } from "../../redux/rtk/features/award/awardSlice";
import PageTitle from "../page-header/PageHeader";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import GetAllAward from "./GetAllAward";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import moment from "moment";
import { addAwardHistory, loadAllAwardHistory } from "../../redux/rtk/features/awardHistory/awardHistorySlice";
import TextArea from "antd/lib/input/TextArea";
import GetAllAssignAward from "./GetAllAssignAward";

const AssignAward = ({ drawer }) => {
	const { list, loading } = useSelector((state) => state.award);
    
	const [loader, setLoader] = useState(false);
    const users = useSelector((state) => state.users?.list)
	const [form] = Form.useForm();
	const dispatch = useDispatch();
    const oneMonthAgo = moment().subtract(0, 'months');
	useEffect(() => {
		dispatch(loadAllAward());
        dispatch(loadAllStaff({ status: true }));
        dispatch(loadAllAwardHistory()) 
        form.setFieldsValue({ awardedDate: oneMonthAgo });
	}, []);
    const handlemonthchange=(value)=>{

        const year = value.year(); 
        const month = value.month() + 1;
		form.setFieldsValue({ awardedDate: value });
        // setcurrentMonth(month)
        // setcurrentYear(year)
     }
	const { Title } = Typography;

	const onFinish = async (values) => {
        console.log("values", values)
		setLoader(true);
		const resp = await dispatch(addAwardHistory(values));

		if (resp.payload.message === "success") {
			setLoader(false);
			form.resetFields();
            dispatch(loadAllAwardHistory())
		} else {
			setLoader(false);
		}
	};

	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding department");
		setLoader(false);
	};
    const disabledDate = (current) => {
        // Disable months beyond the previous month
        return current && current > moment().endOf('month').subtract(0, 'months');
      };
	return (
		<Fragment bordered={false}>
			<PageTitle title='Back' />

			<UserPrivateComponent permission={"create-award"}>
				<Row className='mr-top' justify={drawer ? "center" : "space-between"}>
					{/* {console.log('list',list,'users',users)} */}
                    <Col
						xs={24}
						sm={24}
						md={24}
						lg={drawer ? 22 : 16}
						xl={drawer ? 22 : 12}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
				      		Assign Award
						</Title>
						<Form
							style={{ marginBottom: "40px" }}
							form={form}
							eventKey='department-form'
							name='basic'
							labelCol={{
								span: 6,
							}}
							wrapperCol={{
								span: 12,
							}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete='off'>
							<div>
								
                            <Form.Item
									style={{ marginBottom: "10px" }}
									label='Select User'
									name='userId'
									rules={[
										{
											required: true,
											message: "Please Select User!",
										},
									]}>
									<Select
										mode='single'
										placeholder='Select User'
										optionFilterProp='children'>
											{users?.map((item)=>{
										    return <Select.Option value={item.id}>{item.firstName} {item.lastName} - {item.employeeId  }</Select.Option>
											})}
									</Select>
								</Form.Item>
                                <Form.Item
									style={{ marginBottom: "10px" }}
									label='Select Award'
									name='awardId'
									rules={[
										{
											required: true,
											message: "Please Select User!",
										},
									]}>
									<Select
										mode='single'
										placeholder='Select User'
										optionFilterProp='children'>
											{list?.map((item)=>{
										    return <Select.Option value={item.id}>{item.name}</Select.Option>
											})}
									</Select>
								</Form.Item>
                           <Form.Item
                                label="Select Month"
                                name="awardedDate"
                                style={{ marginBottom: "10px" }}
                                rules={[
                                {
                                    required: true,
                                    message: "Please input date!",
                                },
                                ]}
                            >
                                   <DatePicker picker="month"  defaultValue={oneMonthAgo} onChange={handlemonthchange} disabledDate={disabledDate}/>
                                </Form.Item>
                                <Form.Item
									style={{ marginBottom: "20px" }}
									label='Comment'
									name='comment'
									rules={[
										{
											required: false,
											message: "Please input your Award Comment!",
										},
									]}>
										    <TextArea
												placeholder="Award Comment"
												autoSize={{
												minRows: 3,
												maxRows: 5,
												}}
											/>
									</Form.Item>
								<Form.Item
									style={{ marginBottom: "10px" }}
									wrapperCol={{
										offset: 6,
										span: 12,
									}}>
									<Button
										onClick={() => setLoader(true)}
										type='primary'
										size='large'
										htmlType='submit'
										block
										loading={loader}>
										Assign Award 
									</Button>
								</Form.Item>
							</div>
						</Form>
					</Col>
				</Row>
			</UserPrivateComponent>
			<hr />
			<UserPrivateComponent permission={"readAll-shift"}>
                {users.length>0 && list.length>0 && <GetAllAssignAward users={users} awardlist={list}/> }
				
			</UserPrivateComponent>
		</Fragment>
	);
};

export default AssignAward;
