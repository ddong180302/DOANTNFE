import { useState, useEffect } from 'react';
import { CodeOutlined, ContactsOutlined, DashOutlined, LogoutOutlined, MenuFoldOutlined, RiseOutlined, TwitterOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Dropdown, MenuProps, Space, message } from 'antd';
import { Menu, ConfigProvider } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from './modal/manage.account';

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const userRole = user?.role?.name;
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const [current, setCurrent] = useState('home');
    const location = useLocation();

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);
    const userId = user?._id;
    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])
    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            icon: <TwitterOutlined />,
        },
        {
            label: <Link to={'/job'}>Việc Làm IT</Link>,
            key: '/job',
            icon: <CodeOutlined />,
        },
        {
            label: <Link to={'/company'}>Top Công ty IT</Link>,
            key: '/company',
            icon: <RiseOutlined />,
        }
    ];



    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

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
            label:
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpenManageAccount(true)}>
                    Quản lý tài khoản
                </label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        }, {
            label: <Link
                to={"/admin"}
            >Trang Quản Trị</Link>,
            key: 'admin',
            icon: <DashOutlined />
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        }
    ];

    const itemsDropdownHr = [
        {
            label:
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpenManageAccount(true)}>
                    Quản lý tài khoản
                </label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        }, {
            label: <Link
                to={"/hr"}
            >Trang Quản Trị</Link>,
            key: 'hr',
            icon: <DashOutlined />
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    const itemsDropdownUser = [
        {
            label:
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpenManageAccount(true)}>
                    Quản lý tài khoản
                </label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];
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
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobile ?
                        <div style={{ display: "flex", gap: 30 }}>
                            <div className={styles['brand']} >
                                {/* <FaReact onClick={() => navigate('/')} title='Nice Job' /> */}
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#fff',
                                            colorBgContainer: 'transparent',
                                            colorText: '#a7a7a7',
                                        },
                                    }}
                                >

                                    <Menu
                                        // onClick={onClick}
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                    />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ?
                                        <div className={styles["auth"]}>
                                            <Link to={'/contact'} className={styles["link"]}>Nhà Tuyển Dụng</Link>
                                            <Link to={'/register'} className={styles["link"]}>Đăng Ký</Link>
                                            <Link to={'/login'} className={styles["link"]}>Đăng Nhập</Link>
                                        </div>
                                        :
                                        (
                                            userRole === "USER" ?
                                                <div className={styles["manage"]}>
                                                    <Button className={styles["chat"]} onClick={() => handleChat()}>Chat ngay</Button>
                                                    <div className={styles["link"]}>
                                                        <Link to={'/contact'} className={styles["link"]}>Nhà Tuyển Dụng</Link>
                                                    </div>
                                                    <Dropdown menu={{ items: itemsDropdownUser }} trigger={['click']}>
                                                        <Space style={{ cursor: "pointer" }}>
                                                            <span>{user?.name}</span>
                                                            <Avatar>{user?.name?.substring(0, 2)?.toUpperCase()}</Avatar>
                                                        </Space>
                                                    </Dropdown>
                                                </div>
                                                :
                                                userRole === "HR" ?
                                                    <div>
                                                        <Dropdown menu={{ items: itemsDropdownHr }} trigger={['click']}>
                                                            <Space style={{ cursor: "pointer" }}>
                                                                <span>{user?.name}</span>
                                                                <Avatar>{user?.name?.substring(0, 2)?.toUpperCase()}</Avatar>
                                                            </Space>
                                                        </Dropdown>
                                                    </div>
                                                    :
                                                    <div>
                                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                                            <Space style={{ cursor: "pointer" }}>
                                                                <span>{user?.name}</span>
                                                                <Avatar>{user?.name?.substring(0, 2)?.toUpperCase()}</Avatar>
                                                            </Space>
                                                        </Dropdown>
                                                    </div>
                                        )
                                    }
                                </div>

                            </div>
                        </div>
                        :
                        <div className={styles['header-mobile']}>
                            <span>Your APP</span>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    }
                </div>
            </div>
            <Drawer title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    )
};

export default Header;