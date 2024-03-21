import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

import { Badge, Button, Col, Dropdown, Menu, Popover, Row } from "antd";

import { LogoutOutlined, UserOutlined ,BellOutlined} from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useDispatch } from "react-redux";
import { getNotificationList, updateNotifications } from "../../redux/rtk/features/notifications/notificationSlice";
import { useSelector } from "react-redux";

const toggler = [
	<svg
		width='20'
		height='20'
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 448 512'
		key={0}>
		<path d='M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z'></path>
	</svg>,
];

function Header({ onPress, collapsed, handleCollapsed }) {
	

	const dispatch = useDispatch()
	const [notificationCount, setnotificationCount] = useState(0)
	const notificationList = useSelector(state=> state.notificationSlice.list)
	const [loading, setLoading] = useState(false)
	useEffect(()=>{
		
		dispatch(getNotificationList())
		
	},[loading])
	useMemo(()=>{
		let count=0
		notificationList?.forEach(item => {
			if(item.isRead=== false){
				count++
			}
		})
		setnotificationCount(count)
	},[notificationList])

	useEffect(() => window.scrollTo(0, 0));

	const isLogged = localStorage.getItem("isLogged");
	const user = localStorage.getItem("user");
   
	const items = [
		{
			key: "1",
			label: (
				<p
					style={{ margin: 0, padding: "0.2rem 0.5rem" }}
					className='flex align-items-center p-0.5'>
					<UserOutlined style={{ fontSize: "16px" }} />{" "}
					<span className='logout-text font-weight-bold me-2 ms-1'>{user}</span>
				</p>
			),
		},
		{
			key: "2",
			label: (
				<p
					style={{ margin: 0, padding: "0.2rem 0.5rem" }}
					className='flex align-items-center'>
					<Link to='/admin/auth/logout' className={styles.logoutLink}>
						<LogoutOutlined className='text-danger' />
						<span className='logout-text font-weight-bold'>Log Out</span>
					</Link>
				</p>
			),
		},
	];

	const [isDarkMode, setDarkMode] = useState(false);

	const toggleDarkMode = (checked) => {
		setDarkMode(checked);
	};
   const navigate = useNavigate()
	useEffect(() => {
		if (isDarkMode) document.body.className = "dark-theme";
		if (!isDarkMode) document.body.className = "light-theme";
	}, [isDarkMode,loading]);

		const content = (
			<div className="Notification_content_wrapper">
				{notificationList?.map(item=> {
						return <p onClick={()=>{ 
								navigate(`${item.url}`)
								dispatch(updateNotifications({id:item.id}))
								setLoading(!loading)
						}} className={item.isRead ? "notification_readed":"notification_unreaded"}> Pending - {item.notificationReason}</p>
				})}
			</div>
		);
	return (
		<>
			{console.log('notificationList',notificationList)}
			<Row gutter={[24, 0]}>
				<Col span={24} md={4}>
					<div className={styles.sidebarTogglerPC}>
						{isLogged &&
							React.createElement(
								collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
								{
									className: `${styles.trigger}`,
									onClick: () => handleCollapsed(!collapsed),
								}
							)}
					</div>
				</Col>
				<Col span={24} md={20} className={`${styles.headerControl} notifications_wrapper`}>
					    <Popover content={content} placement="bottomRight" title="Notifications" style={{width:'450px'}}>
							<Badge count={notificationCount}>
								<BellOutlined style={{ fontSize: '23px', color: '#08c' }}/>
							</Badge>
						</Popover>
					<DarkModeSwitch
						style={{ margin: "1rem" }}
						checked={isDarkMode}
						onChange={toggleDarkMode}
						size={20}
					/>
					{/* {isLogged && (
            <Typography.Title
              level={5}
              style={{ margin: 0 }}
              className="me-3 flex align-items-center"
            >
              <UserOutlined style={{ fontSize: "16px" }} />{" "}
              <span className="logout-text font-weight-bold me-2 ms-1">
                {user}
              </span>
            </Typography.Title>
          )} */}
          
					{!isLogged && (
						<Link to='/admin/auth/login' className='btn-sign-in text-dark'>
							<span></span>
						</Link>
					)}

					{isLogged && (
						<Button
							type='link'
							className={styles.sidebarTogglerMobile}
							onClick={() => onPress()}
							style={{ boxShadow: "none" }}>
							{toggler}
						</Button>
					)}
					{isLogged && (
						<div>
							{/* <Dropdown
								overlay={<Menu items={items} />}
								placement='bottomLeft'
								className='user-dropdown'>
								<Button className='user-btn'>
									<UserOutlined style={{ fontSize: "16px" }} />
								</Button>
							</Dropdown> */}

							<p
								style={{ margin: 0, padding: "0.2rem 0.5rem" }}
								className='flex align-items-center'>
								<Link to='/admin/auth/logout' className={styles.logoutLink}>
									<LogoutOutlined className='text-danger' rotate={270} />
									{/* <span className='logout-text font-weight-bold'>Log Out</span> */}
								</Link>
							</p>
						</div>
					)}
				</Col>
			</Row>
		</>
	);
}

export default Header;
