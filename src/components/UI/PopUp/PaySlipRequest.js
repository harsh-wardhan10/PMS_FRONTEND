import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Tag, Typography } from "antd";

import dayjs from "dayjs";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import getUserFromToken from "../../../utils/getUserFromToken";
import { addDeductions } from "../../../redux/rtk/features/deductions/deductionSlice";
import { loadAllShift } from "../../../redux/rtk/features/shift/shiftSlice";
import { loadAllStaff } from "../../../redux/rtk/features/user/userSlice";
import UserPrivateComponent from "../../PrivateRoutes/UserPrivateComponent";
import { generatePayslipRequest, loadAllPayslipRequest, payslipDate } from "../../../redux/rtk/features/payslip/paySlipSlice";
import moment from "moment";



const PaySlipRequest = ({ drawer , isModalVisible, setIsModalVisible }) => {
	const [loader, setLoader] = useState(false);
	
	const users = useSelector((state) => state.users?.list);

    const [selectedMonth, setSelectedMonth] =useState()

	const { TextArea } = Input;
	const id = getUserFromToken();
	const dispatch = useDispatch();
  
	const { Title } = Typography;
	const [form] = Form.useForm();

    const handleDateChange=(value)=>{

        //   console.log('value',value,dayjs(value))
          const year = value.year(); 
          const month = value.month() + 1;
          setSelectedMonth(value)
		  dispatch(payslipDate({year:year,month:month}))
    }
    const disabledDate = (current) => {
        // Disable months beyond the previous month
        return current && current > moment().endOf('month').subtract(1, 'months');
      };
	const onFinish = async (values) => {
		const payslipData = {
			...values,
            monthYear:dayjs(selectedMonth),
			userId: values.userId,
		};
        delete payslipData.date;
        // console.log('payslipData',payslipData)
		setLoader(true);
        setIsModalVisible(false)
		const resp = await dispatch(generatePayslipRequest(payslipData));
		if (resp.payload.message === "success") {
			setLoader(false);
			form.resetFields();
			dispatch(loadAllPayslipRequest());
		} else {
			setLoader(false);
		}
	};
    useEffect(() => {
		dispatch(loadAllShift());
		dispatch(loadAllStaff({ status: true }));
	}, []);
	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding shift");
		setLoader(false);
	};
	return (
		<Fragment bordered={false}>
			<UserPrivateComponent permission={"create-deductions"}>
				<Row className='mr-top' justify={drawer ? "center" : "center"}>
					<Col
						xs={24}
						sm={24}
						md={24}
						// lg={drawer ? 22 : 16}
						// xl={drawer ? 22 : 12}
						className='column-design border rounded card-custom'>
						<Title level={4} className='m-2 mt-5 mb-5 text-center'>
							Request for PaySlip
						</Title>
						{/* {console.log('users',users,'leavePolicy',leavePolicy)} */}
						<Form
							form={form}
							style={{ marginBottom: "40px" }}
							eventKey='shift-form'
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
											{users.map((item)=>{
										    return <Select.Option value={item.id}>{item.firstName} {item.lastName} - {item.employeeId  }</Select.Option>
											})}
									</Select>
								</Form.Item>
                    
                                <Form.Item
									label='Select Month'
									name='date'
									style={{ marginBottom: "10px" }}
									rules={[
										{
											required: true,
											message: "Please input date!",
										},
									]}>
									<DatePicker picker="month"  defaultValue={''} onChange={handleDateChange} disabledDate={disabledDate}/>
								</Form.Item>
								<Form.Item
									style={{ marginBottom: "20px" }}
									label='Comment'
									name='reason'
									rules={[
										{
											required: true,
											message: "Please input your shift!",
										},
									]}>
										    <TextArea
												placeholder="Payslip Comment"
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
										Send for Approval
									</Button>
								</Form.Item>
							</div>
						</Form>
					</Col>
				</Row>
			</UserPrivateComponent>
		</Fragment>
	);
};

export default PaySlipRequest;
