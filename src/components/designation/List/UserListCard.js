import { Card, Col, Row, Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import ViewBtn from "../../Buttons/ViewBtn";
import UserPrivateComponent from "../../PrivateRoutes/UserPrivateComponent";

const UserListCard = ({ list, loading }) => {
	const columns = [
		{
			title: "Employee ID",
			dataIndex: "employeeId",
			key: "employeeId",
			render: (employeeId, record) => {

				return <Link to={`/admin/hr/staffs/${record.id}`}>{employeeId}</Link>	

			},
		},
		{
			title: "Employee Name",
			key: "employee",
			render: ({ firstName, lastName, id }) => (
				<Link to={`/admin/hr/staffs/${id}`}>{firstName + " " + lastName}</Link>
			),
		},
		{
			title: "Action",
			dataIndex: "id",
			key: "action",
			render: (id) => (
				<UserPrivateComponent permission={"readSingle-user"}>
					<ViewBtn path={`/admin/hr/staffs/${id}`} />
				</UserPrivateComponent>
			),
		},
	];

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<Row>
			 {/* {console.log('list',list)} */}
			<Col span={24}>
				<Card
					className='header-solid h-full'
					bordered={false}
					// title={[
					// 	<h5 className='font-semibold m-0 text-center'>
					// 		Employee List
					// 	</h5>,
					// ]}
					bodyStyle={{ padding: "0" }}>
					<div className='col-info'>
						<Table
							scroll={{ x: true }}
							loading={loading}
							columns={columns}
							dataSource={list ? addKeys(list) : []}
						/>
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default UserListCard;
