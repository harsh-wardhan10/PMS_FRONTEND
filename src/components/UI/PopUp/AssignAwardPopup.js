import { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Modal,
  Typography,
  InputNumber,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getRoles } from "../../role/roleApis";
import BtnEditSvg from "../Button/btnEditSvg";
import dayjs from "dayjs";
import {
  clearUser,
  loadAllStaff,
  loadSingleStaff,
  updateUser,
} from "../../../redux/rtk/features/user/userSlice";
import { toast } from "react-toastify";
import { getDepartments } from "../../department/departmentApis";
import { loadAllShift } from "../../../redux/rtk/features/shift/shiftSlice";
import { loadAllLeavePolicy } from "../../../redux/rtk/features/leavePolicy/leavePolicySlice";
import { loadAllWeeklyHoliday } from "../../../redux/rtk/features/weeklyHoliday/weeklyHolidaySlice";
import { useParams } from "react-router-dom";
import moment from "moment";
import { loadAllTaxes } from "../../../redux/rtk/features/tax/taxSlice";
import { loadAllAward } from "../../../redux/rtk/features/award/awardSlice";

const AssignAwardPopup = ({  users, awardList }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const [taxes, settaxes] = useState([]);
  const { id } = useParams("id");

  const dispatch = useDispatch();
  const { Title } = Typography;
  const { Option } = Select;


//   const users = useSelector((state) => state.users?.list);
//   const awardList= useSelector(state => state.award.list)


  useEffect(() => {
    // dispatch(loadAllAward())
    // // dispatch(loadAllStaff({ status: true }));
  }, []);


  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
    //   console.log('values', values , taxes)
    //   const resp = await dispatch(
    //     updateUser({
    //       id: id,
    //       values: {
    //         ...values,
    //         roleId: roleId ? roleId : data.roleId,
    //         departmentId: departmentId ? departmentId : data.departmentId,
    //         shiftId: shiftId ? shiftId : data.shiftId,
    //         leavePolicyId: leavePolicyId ? leavePolicyId : data.leavePolicyId,
    //         weeklyHolidayId: weeklyHolidayId
    //           ? weeklyHolidayId
    //           : data.weeklyHolidayId,
    //         taxes: taxes,
    //         // salaryHistoryId: user?.salaryHistory[0].id,
    //       },
    //     })
    //   );

    //   setLoader(true);
    //   if (resp.payload.message === "success") {
    //     setLoader(false);
    //     dispatch(clearUser());
    //     dispatch(loadSingleStaff(id));
    //     setIsModalOpen(false);
    //   } else {
    //     setLoader(false);
    //   }

    //   form.resetFields();
    } catch (error) {
      console.log(error.message);
      setLoader(false);
      toast.error("Something went wrong");
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoader(false);
    console.log("Failed:", errorInfo);
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]; // blood groups

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
        <Button type="primary" onClick={showModal}>
          Assign Award
      </Button>
      <Modal
        width={"50%"}
        title="Update Employee Information"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          size="small"
          form={form}
          name="basic"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <h2 className="text-center text-xl mt-3 mb-3 txt-color">
            User Information
          </h2>
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
											{awardList?.map((item)=>{
										    return <Select.Option value={item.id}>{item.name}</Select.Option>
											})}
									</Select>
								</Form.Item>
                                
                                
          <Form.Item
            style={{ marginBottom: "10px", marginTop: "10px" }}
            wrapperCol={{
              offset: 4,
              span: 16,
            }}
          >
            <Button
              className="mt-5"
              block
              onClick={() => setLoader(true)}
              type="primary"
              shape="round"
              htmlType="submit"
              loading={loader}
            >
              Assign Award
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AssignAwardPopup;
