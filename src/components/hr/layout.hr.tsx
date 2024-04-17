import React, { useState, useEffect } from 'react';
import {
    AppstoreOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AliwangwangOutlined,
    BugOutlined,
    ScheduleOutlined,
    HomeOutlined,
    HeartTwoTone,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button } from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { callLogout } from 'config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { ALL_PERMISSIONS } from '@/config/permissions';


const { Content, Footer, Sider } = Layout;

const LayoutHr = () => {
    const location = useLocation();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const user = useAppSelector(state => state.account.user);
    const userId = user?._id;
    const permissions = useAppSelector(state => state.account.user.permissions);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (permissions?.length) {
            const viewCompany = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.method
            )

            const viewJob = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.JOBS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.JOBS.GET_PAGINATE.method
            )
            const viewResume = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.method
            )
            const full = [
                {
                    label: <Link to='/hr'>Dashboardhr</Link>,
                    key: '/hr',
                    icon: <AppstoreOutlined />
                },
                ...(viewCompany ? [{
                    label: <Link to='/hr/company'>Company</Link>,
                    key: '/hr/company',
                    icon: <BankOutlined />,
                }] : []),
                ...(viewJob ? [{
                    label: <Link to='/hr/job'>Job</Link>,
                    key: '/hr/job',
                    icon: <ScheduleOutlined />
                }] : []),
                ...(viewResume ? [{
                    label: <Link to='/hr/resume'>Resume</Link>,
                    key: '/hr/resume',
                    icon: <AliwangwangOutlined />
                }] : []),
                {
                    label: <Link to='/'>Home</Link>,
                    key: '/',
                    icon: <HomeOutlined />
                },
            ];
            setMenuItems(full);
        }
    }, [permissions])

    useEffect(() => {
        setActiveMenu(location.pathname)
    }, [location])

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];
    const handleChat = () => {
        if (isAuthenticated) {
            // Nếu đã đăng nhập, chuyển hướng người dùng đến trang tin nhắn và truyền tham số firstId và secondId
            navigate('/messages', { state: { userId } });
        } else {
            // Nếu chưa đăng nhập, đưa người dùng đến trang đăng nhập
            navigate('/login');
        }
    };
    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-hr"
            >
                {!isMobile ?
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}>
                        <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                            <BugOutlined />  HR
                        </div>
                        <Menu
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                    :
                    <Menu
                        selectedKeys={[activeMenu]}
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        mode="horizontal"
                    />
                }

                <Layout>
                    {!isMobile &&
                        <div className='hr-header' style={{ display: "flex", justifyContent: "space-between", marginRight: 20 }}>
                            <Button
                                type="text"
                                icon={collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined)}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <Button style={{ marginTop: "20px" }} onClick={() => handleChat()}>Chat ngay</Button>
                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }}>
                                    {user?.name}
                                    <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
                                </Space>
                            </Dropdown>
                        </div>
                    }
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ padding: 10, textAlign: 'center' }}>
                        React Typescript series Nest.JS &copy; Made with <HeartTwoTone />
                    </Footer>
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutHr;